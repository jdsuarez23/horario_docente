// Declaración de tipos para módulos JSX
declare module '*.jsx' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

// Declaración de tipos para módulos JS
declare module '*.js' {
  const content: any;
  export default content;
}

// Declaración para react-router-dom
import 'react-router-dom';