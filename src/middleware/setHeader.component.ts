// import {RestServer, RestServerConfig} from '@loopback/rest';
// import {inject} from '@loopback/core';

// export class MyRestServer extends RestServer {
//   constructor(@inject('rest.server.config') config: RestServerConfig) {
//     super(config);

//     this.configureHeaders();
//   }

//   private configureHeaders() {
//     this.handler = async (req, res, next) => {
//       res.setHeader('X-Custom-Header', 'YourValue');
//       // Call the original handler
//       return await super.handler(req, res, next);
//     };
//   }
// }
