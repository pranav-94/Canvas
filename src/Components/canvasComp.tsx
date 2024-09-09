import  { useRef, useState, useEffect } from "react";

const MyCanvas = () => {
  const theCanvas = useRef(null);
  const [theText, setTheText] = useState("");
  const [textPos, setTextPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [txtSize, setTxtSize] = useState(24);
  const [txtStyle, setTxtStyle] = useState("Arial");
  const [moves, setMoves] = useState([{ x: 50, y: 50 }]); // History
  const [undoStack, setUndoStack]:any = useState([]);

  // Handle input text
  const askForText = () => {
    const newTxt = prompt("Enter text:");
    if (newTxt) {
      setTheText(newTxt);
    }
  };

  // Draw text on canvas
  useEffect(() => {
    const canvasElem:any = theCanvas.current;
    const ctx = canvasElem.getContext("2d");
    ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
    if (theText) {
      ctx.font = `${txtSize}px ${txtStyle}`;
      ctx.fillText(theText, textPos.x, textPos.y);
    }
  }, [theText, textPos, txtSize, txtStyle]);

  // Mouse down event to start dragging
  const startDragging = (e:any) => {
    const canvasElem:any = theCanvas.current;
    const box = canvasElem.getBoundingClientRect();
    const xMouse = e.clientX - box.left;
    const yMouse = e.clientY - box.top;

    const ctx = canvasElem.getContext("2d");
    const textWidth = ctx.measureText(theText).width;
    const textHeight = txtSize;

    if (
      xMouse >= textPos.x &&
      xMouse <= textPos.x + textWidth &&
      yMouse >= textPos.y - textHeight &&
      yMouse <= textPos.y
    ) {
      setIsDragging(true);
      setMouseOffset({ x: xMouse - textPos.x, y: yMouse - textPos.y });
    }
  };

  // Mouse move to drag text
  const dragText = (e:any) => {
    if (isDragging) {
      const canvasElem:any = theCanvas.current;
      const box = canvasElem.getBoundingClientRect();
      const xMouse = e.clientX - box.left;
      const yMouse = e.clientY - box.top;
      const newPos = { x: xMouse - mouseOffset.x, y: yMouse - mouseOffset.y };
      setTextPos(newPos);
      setMoves([...moves, newPos]);
    }
  };

  // Stop dragging
  const stopDragging = () => {
    setIsDragging(false);
  };

  // Undo last move
  const undoMove = () => {
    if (moves.length > 1) {
      const lastMove = moves[moves.length - 10];
      setUndoStack([moves[moves.length - 5], ...undoStack]);
      setMoves(moves.slice(0, moves.length - 5));
      setTextPos(lastMove);
    }
  };

  // Redo the last undone move
  const redoMove = () => {
    if (undoStack.length > 0) {
      const redoPos = undoStack[0];
      setTextPos(redoPos);
      setMoves([...moves, redoPos]);
      setUndoStack(undoStack.slice(1));
    }
  };

  return (
    <div className="flex flex-col items-center mt-5 space-y-4">
      <div className="space-x-2">
        <button className="px-4 py-2 bg-slate-500 rounded-full text-white " onClick={undoMove}>
          Undo
        </button>
        <button className="px-4 py-2 bg-slate-500 rounded-full text-white " onClick={redoMove}>
          Redo
        </button>
      </div>

      <canvas
        ref={theCanvas}
        width={900}
        height={400}
        className="border border-gray-300 cursor-pointer bg-slate-200 shadow-lg"
        onMouseDown={startDragging}
        onMouseMove={dragText}
        onMouseUp={stopDragging}
      />

      <div className=" flex flex-col h-[90px] justify-evenly items-center ">
        <div className="  flex justify-between  w-[900px] ">
            <div className="flex items-center w-[150px] justify-evenly ">
        <p className="font-semibold text-slate-500">Font Size</p>
        <select
          className="border text-white bg-slate-500 h-[40px] rounded-full  px-2 py-1 bg-transperant"
          value={txtSize}
          onChange={(e) => setTxtSize(Number(e.target.value))}
        >
          <option value={16}>16px</option>
          <option value={24}>24px</option>
          <option value={32}>32px</option>
          <option value={40}>40px</option>
        </select>
        </div>

        <button onClick={askForText} className="w-[180px] h-[40px] flex justify-evenly bg-slate-500 items-center rounded-full shadow-lg text-white ml-20">
      <p>ፕ</p>  Add Text
        </button>

        <div className="flex items-center w-[250px] justify-evenly">
        <p className="font-semibold text-slate-500">Font Style</p>
        <select
          className="border border-gray-300 text-white h-[40px] rounded-full bg-slate-500 flex pl-2 pr-2"
          value={txtStyle}
          onChange={(e) => setTxtStyle(e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>
      </div>

      </div>

    </div>
  );
};

export default MyCanvas;
