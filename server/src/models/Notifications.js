import Parse from 'parse/node';
import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';


const Notifications = Parse.Object.extend('Notifications');

const NotificationsType = new GraphQLObjectType({
  name: 'Notifications',
  description: 'A concise description of what Notifications is',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    // XX: you should probably replace this with something
    // relevant to your model
    title: {
      type: GraphQLString,
      resolve: notifications => notifications.get('title'),
    },
    content: {
      type: GraphQLString,
      resolve: notifications => notifications.get('content'),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: notifications => notifications.get('updatedAt').toLocaleDateString(),
    }
    // more field defs here
  }),
});

Notifications.SchemaType = NotificationsType;

Notifications.RootQuery = {
  type: new GraphQLList(Notifications.SchemaType),
  resolve: (_, args, { Query }) => {
    const query = new Query(Notifications);
    return query.find();
  },
};

Notifications.Mutations = {
  addNotifications: {
    type: Notifications.SchemaType,
    description: 'Create a new instance of Notifications',
    args: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { title, content }, { Query, user }) => {
      const notifications = new Query(Notifications).create({ title, content });
      return notifications.save().then(td => td);
    },
  },
  deleteNotifications: {
    type: Notifications.SchemaType,
    description: 'Delete an instance of Notifications',
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (_, { id }, { Query }) =>
      new Query(Notifications).get(id).then((notifications) => {
        if (notifications) {
          return notifications.destroy();
        }
        return notifications;
      }),
  },
};

export default Notifications;
