import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const Drag = () => {
  const canvas = useRef(null);

  const [x, setX] = useState("150");
  const [y, setY] = useState("150");

  useEffect(() => {
    let svg = d3.select(canvas.current);

    svg.on("mousedown", () => {
      updateMousePos(svg);
    })

    svg.on("mouseup", () => {
      fixMousePos(svg);
    })
  })

  const updateMousePos = (svg) => {
    svg.on("mousemove", (event) => {
      let point = d3.pointer(event, canvas.current);
      console.log(point);
      setX(point[0]);
      setY(point[1]);
    })
  }

  const fixMousePos = (svg) => {
    svg.on("mousemove", null);
  }

  return (
    <div className="drag">
      <div className="drag-main-content">
        <div className="canvas">
          <svg
            viewBox="0 0 900 700"
            preserveAspectRatio="xMinYMin"
            width="80%"
            height="80%"
            style={{backgroundColor: "beige"}}
            ref={canvas}
          >
            <circle cx={x} cy={y} r="20" fill="dodgerblue" stroke="purple" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Drag