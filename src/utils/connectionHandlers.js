import { addEdge } from "reactflow";
import { nodeSchemas } from "./nodeSchemas";
import config from "./config.json";

/**
 * Handles variable node connections with type compatibility checking
 * @param {Object} params - Connection parameters {source, target, sourceHandle, targetHandle}
 * @param {Object} workspace - Workspace manager instance
 * @param {Function} setEdges - React state setter for edges
 */
export const onVariableConnect = (
  params,
  workspace,
  setEdges,
  updateNodeFieldFrontend
) => {
  const { source, target, sourceHandle, targetHandle } = params;

  const sourceNode = workspace.getNode(parseInt(source));
  const targetNode = workspace.getNode(parseInt(target));
  const targetSchema = nodeSchemas[targetNode?.type];
  const targetField = targetSchema?.fields.find((f) => f.key === targetHandle);

  const typeMap = {
    string: ["text", "textarea"],
    number: ["number"],
    boolean: ["select"],
  };

  const connectionType = sourceHandle || "default";
  const isCompatible =
    targetField && typeMap[connectionType]?.includes(targetField.type);

  if (!isCompatible) return;

  workspace.connectNodes(parseInt(source), parseInt(target), connectionType);

  const variableValue = sourceNode?.data?.value;
  if (variableValue !== undefined) {
    updateNodeFieldFrontend(target, targetField.key, variableValue);
    workspace.updateNodeField(
      parseInt(target),
      targetField.key,
      variableValue
    );
  }

  setEdges((eds = []) =>
    addEdge(
      {
        ...params,
        sourceHandle,
        targetHandle,
        id: `${source}-${target}-${sourceHandle}-${targetHandle}`,
        label: sourceHandle,
        style: {
          stroke: config.ui.link.color,
          strokeWidth: config.ui.link.thickness,
        },
      },
      eds
    )
  );
};

/**
 * Handles normal node connections
 * @param {Object} params - Connection parameters
 * @param {Object} workspace - Workspace manager instance
 * @param {Function} setEdges - React state setter for edges
 */
export const onNormalConnect = (params, workspace, setEdges) => {
  const { source, target, sourceHandle } = params;

  const connectionType = sourceHandle || "default";

  workspace.connectNodes(parseInt(source), parseInt(target), connectionType);

  setEdges((eds = []) =>
    addEdge(
      {
        ...params,
        id: `${source}-${target}-${connectionType}`,
        label: connectionType,
        style: {
          stroke: config.ui.link.color,
          strokeWidth: config.ui.link.thickness,
        },
      },
      eds
    )
  );
};

/**
 * Creates a connection handler that determines variable vs normal connection
 * @param {Object} workspace - Workspace manager instance
 * @param {Function} setEdges - React state setter for edges
 * @param {Function} updateNodeFieldFrontend - Updates node field in frontend state
 * @returns {Function} Connect handler for React Flow
 */
export const createConnectHandler = (
  workspace,
  setEdges,
  updateNodeFieldFrontend
) => {
  return (params) => {
    const { source, target, sourceHandle, targetHandle } = params;

    const sourceNode = workspace.getNode(parseInt(source));
    const sourceSchema = nodeSchemas[sourceNode?.type];

    const isVariableNode = sourceSchema?.category === "Variable";

    if (isVariableNode && targetHandle) {
      onVariableConnect(
        params,
        workspace,
        setEdges,
        updateNodeFieldFrontend
      );
    } else {
      onNormalConnect(params, workspace, setEdges);
    }
  };
};
