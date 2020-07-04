import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';
import Footer from '../../components/Footer';

describe('<Footer />', () => {
  const footer = mount(<Footer />);

  test('Render Footer Component', () => {
    expect(footer.length).toEqual(1);
  });

  test('Footer have 3 anchors', () => {
    expect(footer.find('a')).toHaveLength(3);
  });

  test('Footer Snapshot', () => {
    const footer = create(<Footer />);
    expect(footer.toJSON()).toMatchSnapshot();
    // jest --updateSnapshot --> para resetear el snapshot y en caso haya cambios el test pase
  });
});
