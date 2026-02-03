/*
  In this folder you can create a mock for a library that is imported from node_modules.

  Create a file in with the same name as the package you want to mock, and that mock will
  automatically be applied: https://stenciljs.com/docs/mocking#mocking-a-library
*/

/*
  For example, if you want to mock md5,
  you'd create a file __mocks__/md5.ts with the following content:
*/
export default () => 'fakehash';
