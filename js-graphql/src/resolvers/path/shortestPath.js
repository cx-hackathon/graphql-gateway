import * as dotenv from 'dotenv';

dotenv.config();

export const shortestPath = async (_p, { input }, { driver }) => {
  console.log('shortestPath input: ', input);
  let session = await driver.session({ database: 'neo4j' });
  let { startNode, endNode } = input;
  const result = await session.run(
    `MATCH (start:Location), (end:Location)
        WHERE ID(start) = toInteger($startNode) AND ID(end) = toInteger($endNode)
        CALL apoc.algo.dijkstra(start, end, 'ROAD', 'cost') YIELD path, weight
        RETURN path`,
    { startNode, endNode },
  );
  session.close();
  const endNodeList = result.records.map((record) => {
    const path = record.get('path');
    return path.segments.map((segment) => {
      return segment.end; //properties.name;
    });
  });
  endNodeList[0].unshift(result.records[0].get('path').start);
  return endNodeList[0].map((node) => ({
    id: node.identity.low,
    name: node.properties.name,
    level: Number(node.properties.level),
  }));
};
