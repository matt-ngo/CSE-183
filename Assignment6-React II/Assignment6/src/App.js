import React from 'react';
import emails from './data/emails.json';

/**
 * Simple component with no state.
 *
 * See the basic-react from lecture 11 for an example of adding and
 * reacting to changes in state and lecture 16 for details on Material-UI
 *
 * @return {object} JSX
 */
function App() {
  return (
    <div>
      <h2>Let&apos;s make this look way better with Material-UI, eh?</h2>
      <table>
        <tbody>
          {emails.map((email) => (
            <tr key={email.id}>
              <td>{email.from}</td>
              <td>{email.subject}</td>
              <td>{email.received}</td>
              <td>{email.trash ? 'Trash' : 'Inbox'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
