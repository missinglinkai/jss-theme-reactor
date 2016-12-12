/* eslint-env mocha */
import { assert } from 'chai';
import { create as createJss } from 'jss';
import VirtualRenderer from 'jss/lib/backends/VirtualRenderer';
import preset from 'jss-preset-default';
import { createStyleManager, createStyleSheet } from 'src';

describe('ssr', () => {
  let styleManager;
  let buttonSheet;
  let iconSheet;

  beforeEach(() => {
    styleManager = createStyleManager({
      jss: createJss(preset()),
    });

    buttonSheet = createStyleSheet('button', {
      root: {
        color: 'red',
      },
    }, { Renderer: VirtualRenderer });

    iconSheet = createStyleSheet('icon', {
      root: {
        color: 'blue',
      },
    }, { Renderer: VirtualRenderer });
  });

  it('should render the sheets to a string in order', () => {
    styleManager.setSheetOrder(['icon', 'button']);

    styleManager.render(buttonSheet);
    styleManager.render(iconSheet);

    const styles = styleManager.sheetsToString();

    assert.strictEqual(
      styles.replace(/\s/g, ''),
      `
        .icon-root-1243194637 {
          color: blue;
        }
        .button-root-3645560457 {
          color: red;
        }
      `.replace(/\s/g, ''),
    );
  });

  it('should render the sheets to a string in a different order', () => {
    styleManager.setSheetOrder(['button', 'icon']);

    styleManager.render(buttonSheet);
    styleManager.render(iconSheet);

    const styles = styleManager.sheetsToString();
    assert.strictEqual(
      styles.replace(/\s/g, ''),
      `
        .button-root-3645560457 {
          color: red;
        }
        .icon-root-1243194637 {
          color: blue;
        }
      `.replace(/\s/g, ''),
    );
  });
});
