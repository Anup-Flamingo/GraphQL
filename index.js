const express = require("express")
const {graphqlHTTP} = require("express-graphql");
const schema = require("./Schema/schema")

const app = express();

const port = 1111;

app.use("/graphql",graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(port, ()=>{
    console.log("Server has started on port ", port);
})

