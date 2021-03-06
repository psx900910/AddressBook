/* eslint comma-dangle: "off", prefer-template: "off", eol-last: "off" */
import Departments from '../models/Departments';
import Notifications from '../models/Notifications';
import Contacts from '../models/Contacts';
import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';
import assert from 'assert';
const queries = {
  contacts: Contacts.RootQuery,
  notifications: Notifications.RootQuery,
  departments: Departments.RootQuery
};
const mutations = [
  Contacts.Mutations,
  Notifications.Mutations,
  Departments.Mutations
];
// XX: check for duplicate mutation declarations
// accross different models
function checkForDuplicates(listOfMutations) {
  const existingMutations = [];
  listOfMutations.forEach(ms => Object.keys(ms).forEach(m => {
    assert(existingMutations.indexOf(m) === -1, 'Duplicate mutation declaration:' + m);
    existingMutations.push(m);
  }));
}
checkForDuplicates(mutations);
export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: Object.assign.apply(this, [
      {},
      ...mutations
    ])
  })
});