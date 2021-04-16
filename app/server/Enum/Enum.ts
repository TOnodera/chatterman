const PolymorphicTables = {
    requests: 'requests'
} as const;
type PolymorphicTables = typeof PolymorphicTables[keyof typeof PolymorphicTables];

const APPLY_SENDER_NOTICE = {
    IS_NOTIFIED_YET: 1, //未送信
    IS_NOTIFIED_DONE: 2 //送信済
} as const;
type APPLY_SENDER_NOTICE = typeof APPLY_SENDER_NOTICE[keyof typeof APPLY_SENDER_NOTICE];

const APPLY_REACTION = {
    IS_ACCEPT_UNTREATED: 0, //未処理
    IS_ACCEPT_ARROW: 1, //OK
    IS_ACCEPT_DENY: 2 //NO
} as const;
type APPLY_REACTION = typeof APPLY_REACTION[keyof typeof APPLY_REACTION];

const ROOM_TYPE = {
    talkroom: 'talkroom',
    directmessage: 'directmessage',
    information: 'information'
} as const;
type ROOM_TYPE = typeof ROOM_TYPE[keyof typeof ROOM_TYPE];

//サーバーdisconnected時の理由
const DISCONNECTED_REASON = {
    SERVER_NAMESPACE_DISCONNECT: 'SERVER_NAMESPACE_DISCONNECT',
    CLIENT_NAMESPACE_DISCONNECT: 'CLIENT_NAMESPACE_DISCONNECT',
    SERVER_SHUTTING_DOWN: 'SERVER_SHUTTING_DOWN',
    TRANSPORT_CLOSE: 'TRANSPORT_CLOSE'

} as const;
type DISCONNECTED_REASON = typeof DISCONNECTED_REASON[keyof typeof DISCONNECTED_REASON];

export { PolymorphicTables, APPLY_SENDER_NOTICE, APPLY_REACTION, ROOM_TYPE, DISCONNECTED_REASON };
