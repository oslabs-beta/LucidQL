import React from "react";
import { runForceGraph } from "./ForceGraphGenerator";
import styles from "./ForceGraph.module.css";
import generateNodeAndLink from './d3DataBuilder';

// The ForceGraph component will be the container for the generated force graph
// and ForceGraphGenerator will generate the graph using D3.

export function ForceGraph({ data, nodeHoverTooltip }) {
  // React ref to reference the container element.
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    // Destroy function will handle the clean up if the component is removed from the DOM.
    let destroyFn;

    if (containerRef.current) {
      const d3Data = generateNodeAndLink(data);
      const { destroy } = runForceGraph(containerRef.current, d3Data, nodeHoverTooltip);
      destroyFn = destroy;
    }

    return destroyFn;
  }, []);

  // creating a reference to the div which will wrap the generated graph and nothing more.
  return <div ref={containerRef} className={styles.container} />;
}