import React from 'react';
import { WrappedRegister } from './Register'

export class Main extends React.Component {
  render() {
    return (
      <div className="main">
        <WrappedRegister/>
      </div>
    );
  }
}