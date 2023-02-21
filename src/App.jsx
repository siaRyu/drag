import { useState, useRef } from "react";
import Draggable from "react-draggable";
import "./App.css";

const MoveItem = (props) => {
  const divRef = useRef();

  return (
    <Draggable
      disabled={!props.useMove}
      grid={[5, 5]}
      bounds="parent"
      onDrag={props.onDrag}
    >
      <div
        className={props.item}
        ref={divRef}
        onClick={() => console.log(divRef.current.offsetLeft)}
      >
        {props.item === "itemMale" || props.item === "itemFemale" ? (
          <input type={"number"} className="numInput" />
        ) : (
          ""
        )}
        <p className="delBtn" onClick={() => props.delItem(props.index)}>
          x
        </p>
      </div>
    </Draggable>
  );
};

function App() {
  const [useMove, setUseMove] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [lockerType, setLockerType] = useState("male");

  const parentRef = useRef(null);

  const handleDrag = (e, ui) => {
    const { width: parentWidth, height: parentHeight } =
      parentRef.current.getBoundingClientRect();

    // Loop through all child elements and limit their movement within th parent boundaries
    Array.from(parentRef.current.children).forEach((child) => {
      const { left, top, width, height } = child.getBoundingClientRect();

      if (ui.x > parentWidth - width) ui.x = parentWidth - width;
      if (ui.y > parentHeight - height) ui.y = parentHeight - height;
      if (ui.x < -left) ui.x = -left;
      if (ui.y < -top) ui.y = -top;
    });
  };

  const delItem = (index) => {
    let temp = [...itemList];
    if (confirm("정말 삭제하시겠습니까?") === true) {
      delete temp[index];
      temp = temp.filter((item) => item !== undefined);
      setItemList(temp);
    }
  };

  const divRef = useRef();

  // window.getComputedStyle(divRef.current).getPropertyValue("transform"); // 좌표 가져오는 코드
  // 해당 코드 결과값 뒷 2자리를 Draggable Position에 넣으면 완성!

  return (
    <div className="App">
      <section className="itemZone">
        <Draggable position={{ x: 300, y: 300 }}>
          <div className="itemMale" ref={divRef} />
        </Draggable>
        <div className="makeZone" ref={parentRef}>
          {itemList.map((item, index) => (
            <MoveItem
              useMove={useMove}
              key={index}
              item={item}
              onDrag={handleDrag}
              delItem={delItem}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="controlZone">
        <button className="controlBtn">저장</button>
        <button className="controlBtn" onClick={() => setUseMove(true)}>
          Move Start
        </button>
        <button className="controlBtn" onClick={() => setUseMove(false)}>
          Move Stop
        </button>
        <button className="controlBtn" onClick={console.log(itemList)}>
          JSON 출력
        </button>

        <button
          className="makeBtn"
          onClick={() => {
            let temp = [...itemList];
            temp.push("vertical");
            setItemList(temp);
          }}
        >
          가로 벽
        </button>
        <button
          className="makeBtn"
          onClick={() => {
            let temp = [...itemList];
            temp.push("horizontal");
            setItemList(temp);
          }}
        >
          세로 벽
        </button>
        <div>
          <button
            className="makeBtn"
            onClick={() => {
              let temp = [...itemList];
              if (lockerType === "male") {
                temp.push("itemMale");
              } else {
                temp.push("itemFemale");
              }
              setItemList(temp);
            }}
          >
            락커
          </button>
          <select
            value={lockerType}
            onChange={(e) => {
              setLockerType(e.target.value);
            }}
            className="selectType"
          >
            <option value={"male"}>남</option>
            <option value={"female"}>여</option>
          </select>
        </div>
      </section>
    </div>
  );
}

export default App;
