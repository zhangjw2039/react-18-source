import ReactDOM from "../dist/node_modules/react-dom/index.js"
import { jsx } from "../dist/node_modules/react/jsx-runtime.js"


function App() {
    return jsx("div", {
        children: /*#__PURE__*/jsx("span", {
            children: "hello, my react"
        })
    })
}

const app = jsx(App);



ReactDOM.createRoot(document.querySelector("#root")).render(app)
