const GraphQL = require('graphql');
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = GraphQL


const CompanyType = new GraphQLObjectType({
    name :"Company",
    fields:()=>({
        id: {type: GraphQLInt},
        companyName: {type: GraphQLString},
        description: {type: GraphQLString},
        users:{
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res=> res.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id: { type: GraphQLInt},
        firstName: { type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
                resolve(parentValue, args){
                    return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(res=>{
                       return  res.data
                    })
                }
        }
    })
})


const RootQueryType = new GraphQLObjectType({
    name: "RootQuery",
    fields:{
        user:{
            type : UserType,
            args : {id: {type: GraphQLInt}},
            resolve(parentValue, args){

            return axios.get(`http://localhost:3000/users/${args.id}`)
            .then(res=>  {
               return  res.data
            })
            .catch(err=> err)
            }
        },
        company:{
            type: CompanyType,
            args: {id: {type: GraphQLInt }},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(res=> res.data)

            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "mutation",
    fields:()=>({
        addUser:{
            type: UserType,
            args:{
                firstName : {type : new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId : {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.post(`http://localhost:3000/users`,{...args})
                .then(res=> res.data)
            }
        },
        deleteUser:{
            type: UserType,
            args: {id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve(parentValue, args){
                return axios.delete(`http://localhost:3000/users/${args.id}`)
                .then(res=> res.data)
            }
        },
        editUser:{
            type: UserType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)},
                firstName: {type: GraphQLString},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/users/${args.id}`,{...args})
                .then(res=> res.data)
            }
        }
    })

})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: Mutation
})