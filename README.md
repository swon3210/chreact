# CHReact.js

CHReact는 간소화된 형태의 React.js 라이브러리입니다.

<br>

## 설치

```
npm install CHReact
```
```
yarn add CHReact
```
<br>

## 사용법

<br>

### index.ts

```typescript
import App from "./components/App";
import initRenderer from "./lib/render";

const $root = document.querySelector("#root");

initRenderer($root, App);
```

<br>

### App.ts

```typescript
import useState from "../lib/hooks/useState";
import Counter from "./Counter";

const App = () => {
  const [count, setCount] = useState(0);

  const onIncrease = () => {
    setCount(count + 1);
  };

  const onDecrease = () => {
    setCount(count - 1);
  };

  const onReset = () => {
    setCount(0);
  };

  return `
    div.container
      (1)span.count
        (2)text: ${count}
      (1)${Counter({
        onIncrease,
        onDecrease,
        onReset,
      })}
  `;
};

export default App;
```

<br>

### Counter.ts

```typescript
import useHandler from "../lib/hooks/useHandler";

interface Props {
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
}

const Counter = ({ onIncrease, onDecrease, onReset }: Props) => {
  useHandler("click", {
    template: "button.increase-button",
    callback: onIncrease,
  });

  useHandler("click", {
    template: "button.decrease-button",
    callback: onDecrease,
  });

  useHandler("click", {
    template: "button.reset-button",
    callback: onReset,
  });

  return `
    div.btn-group
      (2)button.decrease-button
        (3)strong
          (4)text: -
      (2)button.reset-button
        (3)text: RESET
      (2)button.increase-button
        (3)strong
          (4)text: +
        
  `;
};

export default Counter;

```

<br><br>

## 컨셉트

기본적인 사용법은 리액트와 유사하게 구성하였습니다. 기존의 JSX 문법이 아닌 독자적인 문법을 한번 고안해보고 싶어서 함수 컴포넌트가 객체가 아닌 제가 template 이라고 명명한 특수한 형식의 문자열을 return 하도록 지정했습니다.

```jsx
import useState from "../lib/hooks/useState";
import Counter from "./Counter";

const App = () => {
  const [count, setCount] = useState(0);

  const onIncrease = () => {
    setCount(count + 1);
  };

  const onDecrease = () => {
    setCount(count - 1);
  };

  const onReset = () => {
    setCount(0);
  };

  return `
    div.container
      (1)span.count
        (2)text: ${count}
      (1)${Counter({
        onIncrease,
        onDecrease,
        onReset,
      })}
  `;
};

export default App;
```

<br><br>

## Template 문법

<br>

### Template 의 형식

template 은 간단히 말해 html 을 대체하는 문자열이라고 부를 수 있겠습니다. 이 문자열은 크게 다음의 형식을 갖습니다.

```
div#purchase.primary-button
	@data-test-id: testButton
	$background-color: red
	$color: white
	
```

이해를 돕기 위해 문자열의 중간중간을 개행으로 구분지어놓았지만, 개행이나 공백은 넣어도 넣지 않아도 동일하게 동작합니다.

- '#' 은 id 를 지정할 때 사용하는 기호입니다. id 는 한 template 이 여러개를 가질 수 없도록 자체적으로 제한이 걸려 있습니다.
- '.' 은 class 를 지정할 때 사용하는 기호입니다.
    - .class1.class2 형식으로 여러개의 클래스를 한번에 지정하는 것도 가능합니다.
- '@' 는 attribute 를 지정할 때 사용하는 기호입니다.
    - @data-test-id: test1 @data-user-id: user1 형식으로 여러 개의 attribute 를 지정하는 것도 가능합니다.
- '$' 은 style 을 지정할 때 사용하는 기호입니다.
    - $background-color: red $color: white 형식으로 여러 개의 style 을 지정하는 것 또한 가능합니다.

<br>

### Template Nesting

```
div#purchase.primary-button
	@data-test-id: testButton
	$background-color: red
	$color: white
	(1)span
		(2)text: 테스트 버튼
	(1)${ChildCompoenent(props)}
```

하나의 Template 이 대변하는 것은 하나의 HTML 엘리먼트입니다. 여기서 해당 Element 가 가지는 children 을 지정하기 위해 마찬가지로 Template 을 사용할 수도 있고, 최종적으로 Template 을 리턴하는 함수 컴포넌트를 실행시킨 결과물을 넣을 수 있습니다. children 을 지정할 때는 해당 children 이 루트 Element 로부터 어느 정도의 depth 를 가지는 지를 (숫자) 형식으로 지정해주어야 합니다.

만일 HTML 요소가 아니라 단순 텍스트 노드를 child 로 지정하고 싶다면 맨 앞에 'test:' 를 지정해주어야 합니다.

<br><br>

## 전체 구조

```tsx
import "./index.css";

import App from "./components/App";
import initRenderer from "./lib/render";

const $root = document.querySelector("#root");

initRenderer($root, App);
```

기본적인 초기화 방법은 리액트와 완전히 유사합니다. 동적으로 생성되는 HTMLElement 가 붙여질 root 엘리먼트 노드와 전체 Template 문자열을 반환할 루트 함수 컴포넌트를 Renderer 에 넘기면 됩니다.

<br>

### Store

본격적으로 구조를 설명하기 전에, 라이브러리를 import 하는 즉시 생성되는 store 인스턴스에 대해 알아둘 필요가 있습니다. react 는 ReactDom.render() 를 하나의 루트 요소에만 수행할 수 있는 것이 아니라 여러 루트 요소에 적용시킬 수 있습니다. 즉 하나의 어플리케이션이 여러개의 독립적인 VDom 을 가질 수 있고 서로가 간섭하지 않을 수 있게 만들 수 있다는 이야기입니다.

```tsx
const $root1 = document.querySelector("#root1");
const $root2 = document.querySelector("#root2");

initRenderer($root1, App1);
initRenderer($root2, App2);
```

물론 여러개의 root 요소를 지정하는 방식은 리액트를 활용하는데 있어서 거의 시도되지 않는 방식이지만, 그래도 리액트의 이 같은 유연함을 흉내내보고자 했습니다. initRender 함수가 수행되면 Store 에는 'VStorage' 라는 이름의 인스턴스가 생성됩니다. 

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aa6273b1-6a72-4b6e-9940-3f3d16ec2464/Untitled.png)

<br>

### VStorage

initRender 함수가 수행되면 Store 에는 'VStorage' 라는 이름의 인스턴스가 생성됩니다. 이 VStorage 에는 VDom 을 비롯해서 상태관리와 동적 렌더링을 수행하기 위한 모든 객체가 저장됩니다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/92d135ad-535f-4d59-9037-8f06aea87077/Untitled.png)


<br>

### stateStorage

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1ca8413d-a669-4694-a90a-cd1ededb3beb/Untitled.png)

stateStorage 는 말 그대로 각 컴포넌트들이 지닌 상태들이 저장되는 객체입니다. 하나의 컴포넌트 안의 상태들은 하나의 배열에 담깁니다. 그리고 해당 함수 컴포넌트가 실행되는 순서가 key 가 되어 stateStorage 객체 안에 담기게 됩니다.

<br>

### handlerStorage

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a134e826-02ff-428c-b153-8a5dd87a7c7f/Untitled.png)

handlerStorage 는 각 컴포넌트에서 바인딩 시킨 이벤트 핸들러 함수들이 담기는 객체입니다. 이때 해당 이벤트 핸들러의 이벤트 유형 (ex: click, submit...ect) 이 각각의 핸들러들을 분류하는 key 가 되며, 핸들러 함수들은 같은 이벤트 유형끼리 배열에 담겨서 key 와 매칭됩니다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bb37861f-b458-4800-b342-02cbf379f224/Untitled.png)

이때 각각의 handler 객체들은 이벤트 위임에 사용될 Template 문자열과(위에서 언급한 Template 문자열과 동일) 실제 핸들링에 사용될 콜백 함수가 담깁니다.

<br>

### HTMLElementStorage

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d24c3a3c-4fd2-4c05-bdec-87af66467844/Untitled.png)

HTMLElementStorage 은 동적 렌더링 과정에서 생성되는 실제 Dom 노드들이 담기는 객체입니다. 이 노드들은 자신이 생성된 순서를 key 로 하여 담기게 됩니다. 동적 렌더링 과정에서 생성되는 실제 Dom 노드에 대한 참조를 따로 저장하는 이유는 diffing 알고리즘을 통한 부분 렌더링을 위해서입니다. (아래 글에서 추가로 설명하겠습니다)

<br>

### VDom

VDom 은 전체 Dom 트리를 '흉내내는' 객체입니다. Dom 이 여러 개의 노드로 이루어져 있듯, VDom 또한 여러 개의 VElement 로 이루어져 있습니다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/949cad6c-863f-4692-8d1c-09158b1a3cdc/Untitled.png)

**VElement** 는 위와 같은 구조를 가집니다. 실제 Dom 노드의 태그 타입, id, class, attribute, style 을 대변하는 속성들로 이루어져 있으며 이 정보를 이용해서 실제 Dom 노드가 동적으로 생성됩니다.

<br>

## 렌더링 프로세스

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/95a0280d-41c8-477e-aaeb-347507f24656/Untitled.png)

<br>

### initRender

사용될 render 함수와 VStorage 를 store 에 등록하고 초기 렌더링을 수행합니다.

<br>

**전체 코드 (참고용)**

```tsx
export default function initRenderer(
  $root: Element | null,
  rootComponent: Component
) {
  if (!$root) {
    throw Error("존재하지 않는 루트 태그입니다");
  }

  const vStorage = new VStorage($root);

  store.addRenderer($root.id, () => render($root, rootComponent));
  store.addVStorage($root.id, vStorage);

  render($root, rootComponent);
}
```

<br>

### App() : 루트 컴포넌트 실행

- 전체 VDom 을 구성하는데 사용될 Template 문자열을 얻기 위해 루트 함수 컴포넌트를 실행시킵니다.
- 이 과정에서 함수 내부의 useState 와 useHandler 함수가 호출되고 상태와 핸들러 바인딩이 수행됩니다.
    - (관련 설명은 상태 관리 부분에서 하겠습니다)

**전체 코드 (참고용)**

```tsx
import useState from "../lib/hooks/useState";
import Counter from "./Counter";

const App = () => {
  const [count, setCount] = useState(0);

  const onIncrease = () => {
    setCount(count + 1);
  };

  const onDecrease = () => {
    setCount(count - 1);
  };

  const onReset = () => {
    setCount(0);
  };

  return `
    div.container
			$background-color:white
      (1)span.count
        (2)text: ${count}
      (1)${Counter({
        onIncrease,
        onDecrease,
        onReset,
      })}
  `;
};

export default App;
```

<br>

### createVElement

- 얻어낸 Template 문자열에 대한 파싱을 수행합니다. 1차 파싱 결과로 parentTemplate 과 childrenTemplates 를 얻어냅니다.
- parentTemplate 을 한번 더 파싱해서 id, class, style, attribute 정보를 얻어냅니다
- 얻어낸 정보를 바탕으로 VElement 를 생성합니다.
- 이제 얻어낸 childrenTemplates 배열을 대상으로 createVElement 를 재귀적으로 실행해 자식 VElement 들을 얻어냅니다.
- 얻어낸 자식 VElement 배열을 부모 VElement 의 children 속성에 붙입니다.
- 최종적으로 만들어낸 VElement 를 return 합니다
- 이렇게 얻어낸 VElement 의 트리가 VDom 이 됩니다.

**전체 코드 (참고용)**

```tsx
const createVElement = (template: ReturnType<Component>, depth: number) => {
  const [parentTemplate, childrenTemplates] = separateTemplate(template, depth);
  const noBlankParentTemplate = parentTemplate
    .replace(/\n/g, "")
    .replace(/ /g, "");

  if (getIdCounts(noBlankParentTemplate) > 1) {
    throw Error("id 가 여럿인 태그를 만들 수 없습니다");
  }

  const vElement: VElement = {
    type: "div",
    attribute: {},
    style: {},
    children: [],
  };

  setVElementProperty(vElement, getVElementProperty(noBlankParentTemplate));
  setVElementChildren(vElement, childrenTemplates, depth);

  return vElement;
};
```

<br>

### vStorage.compare

이전 VDom 객체와 현재 VDom 객체를 비교하면서 변경사항이 감지되면 해당 변경사항을 현존하는 실제 DOM 에 반영시킵니다. 만일 전체 VDom 구조가 이전과 달라진 것이 감지되면 비교를 멈추고 전달 받은 콜백 함수를 수행합니다. 해당 콜백 함수는 현재로서는 renderHTML 입니다.

**전체 코드 (참고용)**

```tsx
compare(latestVDom: VElement, onFindDifference: Function) {
  if (!this.VDom) {
    throw Error("업데이트 될 VDOM 이 초기화되지 않았습니다.");
  }

  const distortionFound = this.updater(this.VDom, latestVDom);

  if (distortionFound === true) {
    onFindDifference();
  }
}
```

변경 사항을 감지하고 DOM 상에 반영하는 알고리즘은 다음과 같습니다.

- 태그 자체가 변경됬음이 감지되면 VDom 구조가 달라졌다고 인식합니다.
- 기존 요소의 자식이 Element 에서 text 노드로 바뀌었다면 VDom 구조가 달려졌다고 인식합니다.
- 자식의 개수가 바뀌었다면 VDom 구조가 달라졌다고 인식합니다.
- id, class, attribute, style 상의 변경사항이 있으면 해당 VElement 와 대응하는 실제 노드에 변경사항을 반영합니다.
    - 이게 가능한 이유는 비교를 위해 VDom 안의 VElement 들을 조회하는 순서가 HTMLElementStorage 안에 실제 Dom 노드들이 담기는 순서와 일치하기 때문입니다. 굳이 querySelector 메서드를 사용하지 않아도 비교를 수행하는 함수는 지금이 몇번째 비교인지를 알고 있으면 변경사항을 반영해야할 Dom 노드를 곧바로 참조할 수 있습니다.

<br>

### renderHTML

최초 렌더링이거나 VDom 구조 자체의 변경이 감지되었을 경우 수행됩니다. 전달 받은 VDom(VElement) 을 바탕으로 createHTMLElement 함수를 수행하여 루트 Dom 노드를 얻어낸 후 DOM 의 내용물을 해당 Dom 노드로 덮어버립니다.

**전체 코드 (참고용)**

```tsx
const renderHTML = (
  $root: Element,
  rootElement: VElement,
  isInitial: boolean
) => {
  const rootHTMLElement = createHTMLElement(rootElement);

  if (isInitial) {
    $root.appendChild(rootHTMLElement);
  } else {
    $root.replaceChild(rootHTMLElement, $root.firstChild!);
  }
};
```

<br>

### createHTMLElement

renderHTML 안에서 수행되는 함수입니다. 전달 받은 VElement 의 내용물을 바탕으로 실제 Dom 노드를 생성합니다. VElement.children 을 기반으로 children VElement 또한 HTMLElement 로 변환시켜 만들어낸 Dom 노드의 children 으로 붙입니다. 이때 HTMLElement 가 만들어지는 동시에, 해당 노드에 대한 참조가 HTMLElementStorage 안에 담깁니다.

**전체 코드 (참고용)**

```tsx
const createHTMLElement = (vElement: VElement): HTMLElement => {
  const { type, attribute, style, children } = vElement;
  const vStorage = store.getCurrentVStorage();
  vStorage.increaseElementIndex();
  const elementIndex = vStorage.getElementIndex();
  const HTMLElement = document.createElement(type);

  setHTMLElementAttributes(HTMLElement, attribute);

  const elementStyles = getHTMLElementStyles(style);
  HTMLElement.setAttribute("style", elementStyles);

  setHTMLElementChildren(HTMLElement, children);

  vStorage.setElement(elementIndex, HTMLElement);

  return HTMLElement;
};
```

<br><br>

## 상태 관리 프로세스

<br>

### State

```tsx
const [count, setCount] = useState(0);
```

state 는 useState 훅을 수행함과 동시에 생성됩니다. useState는 항상 실행 순서가 보장됩니다. 따라서 useState 는 자신이 몇번째 컴포넌트에서 수행되는 몇번째 useState 인지만 알 수 있으면 실제 state 를 담고 있는 객체와 자신이 return 해야 하는 state 의 위치를 모르더라도 기존의 state 를 참조할 수 있습니다.

setState 는 항상 자신이 실행될 때마다 기존의 state 값과 현재 state 값이 다른지를 검사합니다. 만일 기존의 state 값과 다르다는 것이 감지되면 위에서 설명한 렌더링 프로세스를 수행합니다.

<aside>
💡 주의사항 : 현재는 컴포넌트에 대한 조건부 렌더링으로 인해 전체 useState 실행 순서가 꼬이게 되면 높은 확률로 이전 state 와 현재 state 값이 다른 경우가 발생해서 렌더링 프로세스를 다시 수행하기 때문에(루트 컴포넌트부터 함수 컴포넌트가 다시 수행됨) useState 가 잘못된 상태를 return 할 가능성은 적습니다. 그러나 만일 useState 의 실행 순서가 이전과 달라졌음에도 이전 state 들이 현재 state 들과 모두 같다면 렌더링 프로세스가 다시 수행되지 않을 것이기에 setState 가 잘못된 상태를 변경할 가능성이 있습니다. 이 부분은 설계상의 오류라고 볼 수 있습니다.

</aside>

**전체 코드 (참고용)**

```tsx
import store from "../store";

const useState = <T>(defaultValue: T): [T, (state: T) => void] => {
  const vStorage = store.getCurrentVStorage();
  vStorage.increaseStateIndex();
  const stateIndex = vStorage.getStateIndex();

  if (!vStorage.getState(stateIndex)) {
    vStorage.setState(stateIndex, defaultValue);
  }

  const state = vStorage.getState(stateIndex);

  const setState = (newState: T) => {
    if (state === newState) {
      return;
    }

    vStorage.setState(stateIndex, newState);
    const renderer = store.getCurrentRenderer();
    renderer();
  };

  return [state, setState];
};

export default useState;
```

<br>

### Props

props 는 그저 함수 컴포넌트가 매개변수로 받는 객체에 불과합니다. 내부에는 상위 컴포넌트로 받은 상태, 핸들링을 위한 함수, 그 외 여러 값이 있을 수 있습니다.

<br>

### Handler

```tsx
useHandler("click", {
  template: "button.increase-button",
  callback: onIncrease,
});
```

엘리먼트에 대한 이벤트 바인딩을 수행하기 위해서는 useHandler 훅을 사용합니다. 첫번째 인자로 어떤 이벤트에 대한 바인딩을 수행할 것인지를 넣고 두번째 인자로는 template 과 callback 을 담은 객체를 집어넣어 사용합니다.

template 은 프로퍼티 명이 template 이지만 정확히는 이벤트 위임을 위해 사용될 문자열입니다. 실제로 이벤트 바인딩을 수행할 대상 엘리먼트를 나타내는 Template 전체를 넣어도 되지만 해당 엘리먼트를 특정할 수만 있다면 그 일부만을 집어넣는 것 도한 가능합니다.

이 특성을 이용해서 여러 요소에 대한 이벤트 바인딩을 한번에 수행할 수도 있습니다.

```tsx
template: "button.increase-button"
```

예를 들어 넘겨진 template 값이 위와 같다면 increase-button 이라는 class 를 지니고 있는 모든 button 요소에서 발생한 click 이벤트에 대한 callback 함수 호출이 수행될 것입니다.

**전체 코드 (참고용)**

```tsx
import { DomEvent, Handler } from "../@types/types";
import store from "../store";

const useHandler = (
  event: DomEvent,
  handler: Handler,
  shouldUpdate: boolean = true
) => {
  const vStorage = store.getCurrentVStorage();
  const prevHandler = vStorage
    .getHandlers(event)
    ?.find((prevHandler) => prevHandler.template === handler.template);

  if (!shouldUpdate) {
    prevHandler ?? vStorage.setHandler(event, handler);
    return;
  }

  vStorage.setHandler(event, handler);
};

export default useHandler;
```

<br>

### GlobalEventBinding

useHandler 를 통한 이벤트 바인딩이 가능한 이유는 root 엘리먼트에 이미 수행된 GlobalEventBinding 때문입니다. initRender 가 수행됨과 동시에, initRender 가 넘겨받은 root 엘리먼트에는 click, submit, hover, mouseover, keyup 등 모든 이벤트 유형에 대한 이벤트 바인딩이 수행됩니다. 이로 인해 addEventListener 메서드가 수행되는 시점은 전체를 통틀어 VStorage 가 초기화되는 한번 밖에 없습니다.

GlobalEventBinding 시에 바인딩되는 함수는 handlerStorage 안을 조회합니다. 현재 발생한 이벤트에 대해서 등록된 핸들러 중 target 엘리먼트를 가리키는 template 문자열을 지닌 handler 객체를 발견한다면 해당 handler 객체의 callback 함수를 실행시킵니다.

**전체 코드 (참고용)**

```tsx
const addAllDefaultEventListener = (
  handlerStorage: HandlerStorage,
  $root: Element
) => {
  domEventList.forEach((domEvent) => {
    handlerStorage[domEvent] = [];
    const globalClickEventHandler = getGlobalEventHandler(
      handlerStorage[domEvent]!
    );
    $root.addEventListener(domEvent, globalClickEventHandler);
  });
};
```

```tsx
export const getGlobalEventHandler = (eventHandlers: Handler[]) => ({ target }: Event) => {
    eventHandlers.forEach((handler) => {
      const selector = getElementSelector(handler.template);
      const vElementProperty = getVElementProperty(handler.template);

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (!isRightTarget(target, vElementProperty)) {
        const $closest = target.closest(selector) as HTMLElement;
        if (!$closest) {
          return;
        }

        if (!isRightTarget($closest, vElementProperty)) {
          return;
        }
      }

      handler.callback();
    });
};
```