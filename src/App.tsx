import React, { createRef, useEffect, useRef, useState } from "react"
import {
  CodeEditor,
  FileExplorer,
  Preview,
  Sandpack,
  SandpackConsumer,
  SandpackContext,
  SandpackProvider,
  TranspiledCodeView,
} from "react-smooshpack"
import { IFiles } from "smooshpack"
import "react-smooshpack/src/styles/index.css"
import { fetchProjectFromGitHub } from "./util/githubFetch"
import DevTools from "./devtools/devtools"
import babel from "@babel/core"

const tryFiles = {
  "/src/index.tsx": {
    code: `import React, { StrictMode } from "react";
    import ReactDOM from "react-dom";

    import App from './App'

    const rootElement = document.getElementById("root");
    ReactDOM.render(
      <StrictMode>
        <App />
      </StrictMode>,
      rootElement
    );

    `,
  },
  "/src/App.tsx": {
    code: `import React from "react";

    export default function App() {
      return (
        <div className="App">
          <h1>Hello CodeSandbox</h1>
          <h2>Start editing to see some magic happen!</h2>
        </div>
      );
    }
    `,
  },
}

const dependencies = {
  "@babel/plugin-transform-react-jsx-source": "^7.12.1",
  "@capacitor/core": "1.3.0",
  "@ionic/react": "^5.3.1",
  "@ionic/react-router": "^5.3.1",
  "@types/jest": "24.0.18",
  "@types/node": "12.7.5",
  "@types/react": "^16.9.43",
  "@types/react-dom": "^16.9.8",
  "@types/react-router": "^5.1.8",
  "@types/react-router-dom": "^5.1.5",
  ionicons: "^5.0.1",
  "node-sass": "^4.13.0",
  react: "^16.13.1",
  "react-dom": "^16.13.1",
  "react-live": "^2.2.3",
  "react-router": "^5.2.0",
  "react-router-dom": "^5.2.0",
  "react-scripts": "^3.4.1",
  reselect: "^4.0.0",
}

function getTranspiledCode(sandpack: SandpackContext) {
  var _a, _b
  var activePath = sandpack.activePath,
    bundlerState = sandpack.bundlerState
  if (bundlerState == null) {
    return null
  }
  var tModule = bundlerState.transpiledModules[activePath + ":"]
  return (_b =
    (_a = tModule === null || tModule === void 0 ? void 0 : tModule.source) ===
      null || _a === void 0
      ? void 0
      : _a.compiledCode) !== null && _b !== void 0
    ? _b
    : null
}

// function loadBabel(iframe:any, scriptSource:any) {
//   fetch(scriptSource)
//     .then(response => response.text())
//     .then(input => {
//       const { contentDocument } = iframe;

//       if (contentDocument == null) {
//         // We unmounted in the middle of the sequence.
//         return;
//       }

//       // eslint-disable-next-line no-undef
//       const { code } = babel.transform(input, { presets: ['es2015', 'react'] });

//       const script = contentDocument.createElement('script');
//       script.textContent = code;

//       contentDocument.head.appendChild(script);
//     });
// }

function loadScript(iframe:any, scriptSource:any, onLoadFn:any) {
  const { contentDocument } = iframe;

  const script = contentDocument.createElement('script');
  script.addEventListener('load', onLoadFn);
  script.src = scriptSource;

  contentDocument.head.appendChild(script);
}


const App = () => {
  const [files, setFiles] = useState<IFiles>()
const defaultTabID = 'components'
const iframeRef = useRef(null);
const [tabID, setTabID] = useState(defaultTabID);

  useEffect(() => {
    fetchProjectFromGitHub()
      .then(data => setFiles(data))
      .catch(err => console.log(err))
        const iframe = iframeRef.current;
        //@ts-ignore
        iframe.addEventListener('load', () => {
          // Load React, ReactDOM, and example app after hook has been installed.
          loadScript(
            iframe,
            'https://unpkg.com/react@0.0.0-a1dbb852c/umd/react.development.js',
            () =>
              {}
          );
        });
  }, [])

  return (
    <>
      {tryFiles ? (
        <SandpackProvider
          files={tryFiles || {}}
          dependencies={dependencies}
          entry="/src/index.tsx"
        >
          <SandpackConsumer>
            {sandpack => {
              console.log(sandpack)

              return ""
            }}
          </SandpackConsumer>
          <div
            style={{
              display: "flex",
              maxWidth: "100vw",
              maxHeight: "100vw",
              overflow: "scroll",
            }}
          >
            <FileExplorer
              customStyle={{
                overflow: "scroll",
                padding: "1rem",
                minWidth: "fit-content",
              }}
            />
            <CodeEditor customStyle={{ padding: "1rem" }} />
            <Preview customStyle={{ padding: "1rem" }} />
            <TranspiledCodeView />
            <DevTools tabID={tabID} iframeRef={iframeRef} />
          </div>
        </SandpackProvider>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default App
