const host = "http://localhost:5000";
const registerRoute = `${host}/auth/register`;
const loginRoute = `${host}/auth/login`;
const logoutRoute = `${host}/auth/logout`;
const allNotesGet = `${host}/note/`;
const deleteNoteRoute = `${host}/note/`;
const editNoteRoute = `${host}/note`;
const addNoteRoute = `${host}/note`;
const singleUserRoute = `${host}/user/`;
export {
	host,
	registerRoute,
	loginRoute,
	logoutRoute,
	allNotesGet,
	editNoteRoute,
	singleUserRoute,
	addNoteRoute,
	deleteNoteRoute,
};
