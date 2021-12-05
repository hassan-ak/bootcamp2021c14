# Step01 - GraphQL with Postman

## Class Notes

- [Understand Schemas](https://www.apollographql.com/docs/apollo-server/schema/schema/)
  - GQL is a schema defination language which helps us to communicate with our backend. GQL server uses schema to define shape of the available data. Types can be of two types scalar or object. Scalar can be integer, string or boolean etc. Object type is actually a type defination with multiple fields which can be scalar or objects
- [GraphQL Core Features](https://www.youtube.com/watch?v=eyWE0md1doA&ab_channel=NaveenAutomationLabs)
  - Types
  - Queries
    - Attributes
  - Mutations
  - Subsciptions
- [Hasura PlayGround](https://hasura.io/learn/graphql/graphiql)
  - Run queries in online playground

## Steps

1. Create new collection
2. Create new post request

   - `https://hasura.io/learn/graphql`
   - add Header parameters `Content-Type` and `Authorization`
   - in body section add a QtaphQL query

     ```
     {
         users(limit: 2) {
             name
             todos {
                 title
             }
         }
         online_users(limit: 2) {
             id
             last_seen
         }
     }
     ```

   - Running the request gives the desired response

## Reading Material

- [GraphQL Core Features](https://www.youtube.com/watch?v=eyWE0md1doA&ab_channel=NaveenAutomationLabs)
- [Hasura PlayGround](https://hasura.io/learn/graphql/graphiql)
- [Run GraphQL Queries in Postman](https://www.youtube.com/watch?t=496&v=eyWE0md1doA&feature=youtu.be&ab_channel=NaveenAutomationLabs)
- [GraphQL Client Server Architecture](https://www.youtube.com/watch?v=GWdNTIdinr8&ab_channel=NaveenAutomationLabs)
- [GraphQL Schema, Query and Mutation (CRUD Operation)](https://www.youtube.com/watch?v=VvLHlAsJPsw&ab_channel=NaveenAutomationLabs)
- [Understand Schemas](https://www.apollographql.com/docs/apollo-server/schema/schema/)
- [You can also do it in Postman](https://www.youtube.com/watch?v=VvLHlAsJPsw&t=884s&ab_channel=NaveenAutomationLabs)
- [GraphQL Query Variables](https://www.youtube.com/watch?v=XzBIwKJ0mHo&ab_channel=NaveenAutomationLabs)
- [Free Amazing Public GraphQL APIs for Practice](https://www.youtube.com/watch?v=TozP6fiTbZE&ab_channel=NaveenAutomationLabs)
- [How to do GraphQL Automation with Postman](https://www.youtube.com/watch?v=6PgDCw_Rc5M&ab_channel=TechworldwithSaif)
- [GraphQL in Postman Demo](https://www.youtube.com/watch?v=7pUbezVADQs&ab_channel=Postman)
- [Todo project](https://github.com/panacloud/bootcamp-2021/tree/main/code/project05-aws-graphql)
