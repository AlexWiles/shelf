// https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/babel/transform-prevent-infinite-loops.js

const MAX_ITERATIONS = 500;

export const inifiniteLoopPlugin = ({types: t, template}) => {
  const buildGuard = template(`
    if (ITERATOR++ > MAX_ITERATIONS) {
      window.infiniteLoopError = new RangeError(
        'Potential infinite loop: exceeded ' +
        MAX_ITERATIONS +
        ' iterations.'
      );
      throw window.infiniteLoopError;
    }
  `);

  return {
    visitor: {
      'WhileStatement|ForStatement|DoWhileStatement': (path, file) => {

        // An iterator that is incremented with each iteration
        const iterator = path.scope.parent.generateUidIdentifier('loopIt');
        const iteratorInit = t.numericLiteral(0);
        path.scope.parent.push({
          id: iterator,
          init: iteratorInit,
        });
        // If statement and throw error if it matches our criteria
        const guard = buildGuard({
          ITERATOR: iterator,
          MAX_ITERATIONS: t.numericLiteral(MAX_ITERATIONS),
        });
        // No block statment e.g. `while (1) 1;`
        if (!path.get('body').isBlockStatement()) {
          const statement = path.get('body').node;
          path.get('body').replaceWith(t.blockStatement([guard, statement]));
        } else {
          path.get('body').unshiftContainer('body', guard);
        }
      },
    },
  };
};