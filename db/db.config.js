import mongoose from 'mongoose'


mongoose.connect('mongodb+srv://graphql:graphql@cluster0.je9vked.mongodb.net/', {
    useNewUrlParser:true
})

const con = mongoose.connection

con.on('open', () => {
    console.log('MongoDB SuccessFully connected...')
})