import * as schema from "../../db/schema";
import * as stackModel from "./stackModels";
import * as types from "./types";

export async function controlCreateStack(stack: schema.NewStack) {
  const date = new Date();

  const res = await stackModel.createStack(stack, date);
  return res;
}

export async function controlGetStackById(stackId: string) {
  const res = await stackModel.getStackById(stackId);
  return res;
}

export async function controlGetAllStacksFromMap(mapId: string) {
  const stacks = await stackModel.getStacksFromMap(mapId);
  console.log(stacks);

  const res = transformToHierarchy(stacks);
  return res;
}

const transformToHierarchy = (data: types.Stack[]): types.Stack[] => {
  const lookup: { [key: string]: types.Stack } = {};

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    lookup[item.stack_id] = item;
    item.children = [];
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const parent_id = item.parent_stack_id;
    if (parent_id && lookup[parent_id]) {
      lookup[parent_id].children!.push(item);
    }
  }

  const result: types.Stack[] = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!item.parent_stack_id) {
      result.push(item);
    }
  }

  return result;
};

export async function controlGetHighestOrderStacks(mapId: string) {
  const res = await stackModel.getHighestOrderParentStacks(mapId);
  return res;
}

export async function controlGetDirectChildsFromParent(parentStackId: string) {
  const res = await stackModel.getDirectChildsFromParent(parentStackId);
  return res;
}

export async function controlGetAllChildsFromParent(parentStackId: string) {
  const res = await stackModel.getAllChildsFromParent(parentStackId);
  return res;
}

export async function controlGetParentFromStack(stackId: string) {
  const res = await stackModel.getStackById(stackId);
  return res;
}

export async function controlChangeParentStack(
  parentAndChild: types.ParentAndChildId
) {
  const res = await stackModel.changeParentStack(parentAndChild);
  return res;
}

export async function controlDeleteParentStackRelation(childStackId: string) {
  const res = await stackModel.deleteParentStackRelation(childStackId);
  return res;
}

export async function controlStackDeletionAndChildMoveUp(stackId: string) {
  const res = await stackModel.deleteMiddleOrderStackAndMoveChildsUp(stackId);
  return res;
}

export async function controlStackAndChildDeletion(stackId: string) {
  const res = await stackModel.deleteStackAndChildren(stackId);
  return res;
}
