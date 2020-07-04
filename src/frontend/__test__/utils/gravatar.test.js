import gravatar from '../../utils/gravatar';

test('Gravatar Function test', () => {
  const email = 'elvis.saavedra.segura@gmail.com';
  const gravatarUrl =
    'https://gravatar.com/avatar/14e7efd9e6e047409fb0615f84c17b49';
  expect(gravatarUrl).toEqual(gravatar(email));
});
