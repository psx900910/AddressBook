import Parse from 'parse/node';
import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';


const Departments = Parse.Object.extend('Departments');

const DepartmentsType = new GraphQLObjectType({
  name: 'Departments',
  description: 'A concise description of what Departments is',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    // XX: you should probably replace this with something
    // relevant to your model
    name: {
      type: GraphQLString,
      resolve: departments => departments.get('name'),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: departments => departments.get('updatedAt').toLocaleDateString(),
    }
    // more field defs here
  }),
});

Departments.SchemaType = DepartmentsType;

Departments.RootQuery = {
  type: new GraphQLList(Departments.SchemaType),
  resolve: (_, args, { Query }) => {
    const query = new Query(Departments);
    return query.find();
  },
};

Departments.Mutations = {
  addDepartments: {
    type: Departments.SchemaType,
    description: 'Create a new instance of Departments',
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { name }, { Query, user }) => {
      const departments = new Query(Departments).create({ name });
      return departments.save().then(td => td);
    },
  },
  deleteDepartments: {
    type: Departments.SchemaType,
    description: 'Delete an instance of Departments',
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (_, { id }, { Query }) =>
      new Query(Departments).get(id).then((departments) => {
        if (departments) {
          return departments.destroy();
        }
        return departments;
      }),
  },
  editDepartments: {
    type: Departments.SchemaType,
    description: 'Edit an instance of Departments',
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { id, name }, { Query }) => {
      return new Query(Departments).get(id).then((departments) => {
        if (departments){
          return departments.save({name}).then(td => td);
        }
      });
    },
  },
};

export default Departments;
