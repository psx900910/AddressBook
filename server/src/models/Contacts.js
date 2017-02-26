import Parse from 'parse/node';
import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import Departments from './Departments';


const Contacts = Parse.Object.extend('Contacts');

const ContactsType = new GraphQLObjectType({
  name: 'Contacts',
  description: 'A concise description of what Contacts is',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    // XX: you should probably replace this with something
    // relevant to your model
    name: {
      type: GraphQLString,
      resolve: contacts => contacts.get('name'),
    },
    tel: {
      type: GraphQLString,
      resolve: contacts => contacts.get('tel'),
    },
    email: {
      type: GraphQLString,
      resolve: contacts => contacts.get('email'),
    },
    address: {
      type: GraphQLString,
      resolve: contacts => contacts.get('address'),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: contacts => contacts.get('updatedAt').toLocaleDateString(),
    },
    avatar: {
      type: GraphQLString,
      resolve: contacts => contacts.get('avatar').url(),
    },
    department: {
      type: Departments.SchemaType,
      resolve: contacts => contacts.get('department').fetch({
        success: department => department,
        error: error => error,
      }),
    },
    // more field defs here
  }),
});

Contacts.SchemaType = ContactsType;

Contacts.RootQuery = {
  type: new GraphQLList(Contacts.SchemaType),
  resolve: (_, args, { Query }) => {
    const query = new Query(Contacts);
    return query.find();
  },
};

Contacts.Mutations = {
  addContacts: {
    type: Contacts.SchemaType,
    description: 'Create a new instance of Contacts',
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      tel: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      address: { type: new GraphQLNonNull(GraphQLString) },
      avatarData: { type: new GraphQLNonNull(GraphQLString) },
      departmentId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (_, { name, tel, email, address, avatarData, departmentId }, { Query }) => {
      let avatar = new Parse.File("avatar.jpg", { base64: avatarData });
      return avatar.save().then(()=>
        new Query(Departments).get(departmentId)
      ).then((department) => 
        new Query(Contacts).create({ name, tel, email, address, avatar, department }).save()
      ).then(td => td)
    },
  },
  deleteContacts: {
    type: Contacts.SchemaType,
    description: 'Delete an instance of Contacts',
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (_, { id }, { Query }) =>
      new Query(Contacts).get(id).then((contacts) => {
        if (contacts) {
          return contacts.destroy();
        }
        return contacts;
      }),
  },
  editContactsAvatar: {
    type: Contacts.SchemaType,
    description: 'Edit avatar of an instance in Contacts',
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      avatarData: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { id, avatarData }, { Query }) => {
      let avatar = new Parse.File('avatar.jpg', { base64: avatarData });
      return avatar.save().then(() => 
        new Query(Contacts).get(id)
      ).then((contacts) =>
        contacts.save({ avatar })
      ).then(td => td);
    },
  },
  editContacts: {
    type: Contacts.SchemaType,
    description: 'Edit an instance of Contacts',
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      tel: { type: GraphQLString },
      email: { type: GraphQLString },
      address: { type: GraphQLString },
      departmentId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { id, name, tel, email, address, departmentId }, { Query }) => {
      return new Query(Departments).get(departmentId).then((department) => 
        new Query(Contacts).get(id).then((contacts) => contacts.save({name, tel, email, address, department}))
      ).then(td => td)
    },
  },
};

export default Contacts;
