import {
    Canister,
    ic,
    Err,
    nat64,
    Ok,
    Opt,
    Principal,
    query,
    Record,
    Result,
    StableBTreeMap,
    text,
    update,
    Variant,
    Vec
} from 'azle';

const User = Record({
    id: Principal,
    name: text,
    createdAt: nat64,
    threadIds: Vec(text)
});

type User = typeof User.tsType;

const Thread = Record({
    id: text,
    name: text,
    createdAt: nat64,
    userId: Principal
});

const ThreadInfo = Record({
    id: text,
    name: text,
    createdAt: nat64,
})

type Thread = typeof Thread.tsType;

const RecordsError = Variant({
    ThreadDoesNotExist: Principal,
    UserDoesNotExist: Principal
});
type RecordsError = typeof RecordsError.tsType;

let userStorage = StableBTreeMap<Principal, User>(Principal, User,0);
let threadStorage = StableBTreeMap<text, Thread>(text, Thread, 1);

export default Canister({

    createUser: update([text], User, (name) => {
        const id = ic.caller();
        const user: User = {
            id,
            createdAt: ic.time(),
            threadIds: [],
            name
        };

        userStorage.insert(user.id, user);

        return user;
    }),

    readUsers: query([], Vec(User), () => {
        return userStorage.values();
    }),

    readUserById: query([Principal], Opt(User), (id) => {
        return userStorage.get(id);
    }),

    deleteUser: update([Principal], Result(User, RecordsError), (id) => {
        const userOpt = userStorage.get(id);

        if ('None' in userOpt) {
            return Err({
                UserDoesNotExist: id
            });
        }

        const user = userOpt.Some;

        user.threadIds.forEach((threadId) => {
            threadStorage.remove(threadId);
        });

        userStorage.remove(user.id);

        return Ok(user);
    }),

    createThread: update(
        [ThreadInfo, Principal],
        Result(Thread, RecordsError),
        (threadInfo, userId) => {
            const userOpt = userStorage.get(userId);

            if ('None' in userOpt) {
                return Err({
                    UserDoesNotExist: userId
                });
            }

            const user = userOpt.Some;

            const thread: Thread = {
                id: threadInfo.id,
                createdAt: threadInfo.createdAt,
                name: threadInfo.name,
                userId
            };

            threadStorage.insert(thread.id, thread);

            const updatedUser: User = {
                ...user,
                threadIds: [...user.threadIds, thread.id]
            };

            userStorage.insert(updatedUser.id, updatedUser);

            return Ok(thread);
        }
    ),

    readThreads: query([], Vec(Thread), () => {
        return threadStorage.values();
    }),

    readThreadById: query([text], Opt(Thread), (id) => {
        return threadStorage.get(id);
    }),

    readThreadByUser: query([Principal], Result(Vec(Thread), RecordsError), (id) => {

        const threads: Array<Thread> = new Array<Thread>();
        const userOpt: User = userStorage.get(Principal);

        if ('None' in userOpt) {
            return Err({
                UserDoesNotExist: id
            });
        }

        
        user.threadIds.forEach((threadId) => {
            threads.push(threadStorage.get(threadId));
        });
        
        return threads;
    }),
    deleteThread: update(
        [text],
        Result(Thread, RecordsError),
        (id) => {
            const threadOpt = threadStorage.get(id);

            if ('None' in threadOpt) {
                return Err({ ThreadDoesNotExist: id });
            }

            const thread = threadOpt.Some;

            const userOpt = userStorage.get(thread.userId);

            if ('None' in userOpt) {
                return Err({
                    UserDoesNotExist: thread.userId
                });
            }

            const user = userOpt.Some;

            const updatedUser: User = {
                ...user,
                threadIds: user.threadIds.filter(
                    (threadId) =>
                        threadId !== thread.id
                )
            };

            userStorage.insert(updatedUser.id, updatedUser);

            threadStorage.remove(id);

            return Ok(thread);
        }
    )
});
