
import express, { Application, Request, Response } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ApolloServer } from '@apollo/server';    
async function init(){
      // const app = express(); 
      const app: Application = express();

      app.use(express.json());

      const apolloServerGraph = new ApolloServer({
        typeDefs: ` type Query {
          hello: String,
          say(name: String): String
        }` ,// provide graph ql schema definitions
        resolvers: {

          Query:{
            hello: ()=> `Hey there, I am a graphql server.`,
            say: (_, {name}:{name: string})=>{ return `Hello ${name}`

            }
          }
        }
        
        // provide qeury resolvers here
      });

      // start appolo server
    await apolloServerGraph.start();
    

    const PORT= Number(process.env.PORT) || 9001;
  
 app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(apolloServerGraph, {
    context: async ({ req }: { req: express.Request }) => ({
      token: req.headers.authorization || '',
    }),
  })
);


  //  app.use('/graphql', expressMiddleware(apolloServerGraph, {
  //    context: async ({ req }) => ({ token: req.headers.token })
  //  }));



    app.listen(PORT,()=>{
      console.log('listening port 9001');
    });
}

init();