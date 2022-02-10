import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const ITEM_HEIGHT = 100;

export interface ItemType {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export function getDefaultItemLayout<T>(
  _: T[] | null | undefined,
  index: number
) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

function Item({ item }: { item: ItemType }) {
  return (
    <View style={[styles.root, { height: ITEM_HEIGHT }]}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  description: {
    opacity: 0.7,
    // fontSize: 15,
  },
});

export default React.memo(Item);
