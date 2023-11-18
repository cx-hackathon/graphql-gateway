import * as dotenv from 'dotenv';

dotenv.config();

export const nearbyNode = async (_p, { input }, { driver }) => {
  let session = await driver.session({ database: 'neo4j' });
  let { curLongitude, curLatitude, k = 3 } = input;
  const result = await session.run(`MATCH (n:Location) RETURN n`);
  session.close();
  const mapNodeList = result.records.map((record) => {
    const nodeProps = record.get('n').properties;
    const slong = Math.pow(curLongitude - nodeProps.longitude, 2);
    const slat = Math.pow(curLatitude - nodeProps.latitude, 2);
    const distance = Math.sqrt(slong + slat);
    return { distance, ...nodeProps };
  });
  return mapNodeList.sort((a, b) => a.distance - b.distance).slice(0, k);
};
