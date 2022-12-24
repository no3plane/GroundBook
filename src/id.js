const groundIdMap = [
    { id: 1, name: '仙林1号' },
    { id: 2, name: '仙林2号' },
    { id: 3, name: '仙林3号' },
    { id: 4, name: '仙林4号' },
    { id: 5, name: '三牌楼1号' },
    { id: 6, name: '三牌楼2号' },
    { id: 7, name: '三牌楼3号' },
    { id: 8, name: '三牌楼4号' },
    { id: 13, name: '三牌楼5号' },
    { id: 14, name: '三牌楼6号' },
    { id: 15, name: '场地不可用' }
];

const periodIdMap = [
    { id: 21, name: '15:30-16:00' },
    { id: 22, name: '15:00-16:00' },
    { id: 2, name: '16:00-17:00' },
    { id: 3, name: '17:00-18:00' },
    { id: 4, name: '18:00-19:00' },
    { id: 5, name: '19:00-20:00' },
    { id: 6, name: '20:00-21:00' },
]

function rankObjsByAttr(objs, attrName, attrValueRank) {
    const map = new Map();
    for (const obj of objs) {
        map.set(obj[attrName], obj);
    }
    const result = [];
    for (const attrValue of attrValueRank) {
        result.push(map.get(attrValue));
    }
    return result;
}

export function mapGroundId(groundNames) {
    const rankedGroundIdMap = rankObjsByAttr(groundIdMap, 'name', groundNames);
    return rankedGroundIdMap.map(value => value.id);
}

export function mapPeriodId(periodNames) {
    const rankedPeriodIdMap = rankObjsByAttr(periodIdMap, 'name', periodNames);
    return rankedPeriodIdMap.map(value => value.id);
}

export function getGroundNameById(id) {
    return groundIdMap.find(ground => ground.id === id).name;
}

export function getPeriodNameById(id) {
    return periodIdMap.find(peroid => peroid.id === id).name;
}
