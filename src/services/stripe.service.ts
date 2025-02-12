/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {injectable} from '@loopback/core';
import axios from 'axios';
import Stripe from 'REMOVED';

@injectable()
export class StripeService {
  private REMOVED: Stripe;

  constructor() {
    this.REMOVED = new Stripe(`${process.env.STRIPE_KEY}`);
  }

  async getCustomerByEmail(email: string) {
    const customers = await this.REMOVED.customers.list({
      email,
      limit: 1,
    });
    return customers.data.length > 0 ? customers.data[0] : null;
  }
  async getProductList() {
    const products = await this.REMOVED.products.list({
      limit: 10,
    });
    return products.data.length > 0 ? products.data : null;
  }

  async createCustomer({
    email,
    name,
    paymentMethodId,
  }: {
    email: string;
    name: string;
    paymentMethodId: string;
  }) {
    return this.REMOVED.customers.create({
      email,
      name,
      payment_method: paymentMethodId,
      invoice_settings: {default_payment_method: paymentMethodId},
    });
  }

  async createSubscription(subscriptionParams: any) {
    return this.REMOVED.subscriptions.create(subscriptionParams);
  }
  /**
   * Create a new customer and attach a payment method
   */
  async createCustomerWithPaymentMethod(
    email: string,
    name: string,
    paymentMethodId: string,
  ) {
    try {
      // Create customer
      const customer = await this.REMOVED.customers.create({
        email,
        name,
      });

      // Attach payment method to the customer
    await this.REMOVED.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });
    await this.REMOVED.customers.update(customer.id, {
      invoice_settings: {default_payment_method: paymentMethodId},
    });

      // Optional: Add delay to avoid race condition
      await new Promise(resolve => setTimeout(resolve, 500));

      return customer;
    } catch (error: any) {
      console.error('createCustomerWithPaymentMethod Error:', error);
      throw new Error(
        error.raw?.message || 'Failed to create customer with payment method.',
      );
    }
  }

  async findProductsWithPricesAndCoupons(): Promise<
    {
      productId: string;
      name: string;
      description: string | null;
      price: {
        priceId: string;
        priceName: string | null;
        amount: number | null;
      } | null;
      coupons: {
        couponId: string;
        name: string | null;
      }[];
    }[]
  > {
    try {
      // Retrieve all prices
      const prices = await this.REMOVED.prices.list({limit: 100});

      // Retrieve all products
      const products = await this.REMOVED.products.list({limit: 100});

      // Retrieve all coupons
      const coupons = await this.REMOVED.coupons.list({limit: 100});
      const activeProducts = products.data.filter(
        product => product.active === true,
      );
      console.log('active product', activeProducts);
      // Helper function to fetch coupon details
      const cuponWithProduct = await Promise.all(
        coupons.data.map(async coupon => {
          try {
            const response = await axios.get(
              `https://api.REMOVED.com/v1/coupons/${coupon.id}?expand[]=applies_to`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.STRIPE_KEY}`, // Your Stripe secret key
                },
              },
            );

            return {
              couponId: response.data.id,
              name: response.data.name,
              productIds: response.data.applies_to?.products ?? [], // Associated product IDs
            };
          } catch (err: any) {
            console.error(
              `Error fetching coupon details for ${coupon.id}:`,
              err.message,
            );
            return null;
          }
        }),
      );

      // Filter out any null values from failed requests
      const validCoupons = cuponWithProduct.filter(c => c !== null);

      // Map products with prices and applicable coupons
      const productsWithPricesAndCoupons = activeProducts.map(product => {
        // Find the first price related to the current product
        const relatedPrice = prices.data.find(
          price => price.product === product.id,
        );

        // Find all applicable coupons for this product
        const applicableCoupons = validCoupons
          .filter(coupon => coupon?.productIds.includes(product.id))
          .map(coupon => ({
            couponId: coupon?.couponId ?? '',
            name: coupon?.name ?? null,
          }));

        return {
          productId: product.id,
          name: product.name,
          description: product.description,
          price: relatedPrice
            ? {
                priceId: relatedPrice.id,
                priceName: relatedPrice.nickname ?? null,
                amount: relatedPrice.unit_amount ?? null,
              }
            : null, // No price found
          coupons: applicableCoupons, // List of applicable coupons
        };
      });

      return productsWithPricesAndCoupons;
    } catch (error: any) {
      console.error(
        'Error fetching prices, products, or coupons:',
        error.message,
      );
      throw error;
    }
  }
}
