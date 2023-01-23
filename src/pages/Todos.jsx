import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addNoteRoute,
  allNotesGet,
  deleteNoteRoute,
  editNoteRoute,
  logoutRoute,
  singleUserRoute
} from "../utils/APIRoutes";
import { toast, ToastContainer } from "react-toastify";

export function Todos() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLast, setIsLast] = useState(false);
  const [page, setPage] = useState(1);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({ state: false, title: "" });
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPages, setMaxPages] = useState(0);
  const scrollRef = useRef();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  };

  useEffect(() => {
    axios.get(singleUserRoute, {
      withCredentials: true
    }).then(response => {
      setCurrentUser(response.data);

    }).then(() => {
      setIsUserLoading(false);
    }).catch(error => {
      if (error.response.data.message === "Unauthorized") {
        navigate("/login");
      }
    });
  }, [navigate]);

  useEffect(() => {
    axios.get(allNotesGet, {
      withCredentials: true
    }).then(response => {
      setNotes(response.data.noteData.notes);
      setMaxPages(response.data.noteData.pages);
      if (response.data.noteData.pages === 1){
        setIsLast(true);
      }
      setIsLoading(false);
    }).catch(error => {
      if (error.response.data.message === "Unauthorized") {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleClick = async () => {
    try {
      await axios.get(logoutRoute, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      navigate("/login");
    } catch (error) {
      if (error.response.data.message === "Unauthorized") {
        navigate("/login");
      }
    }
  };

  const handleNoteChange = async e => {
    const { id } = e.target;
    try {
      await axios.put(`${editNoteRoute}/${id}`, {
            state: e.target.checked
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          });
      setNotes(notes.map(note => note._id === id ? { ...note, state: e.target.checked } : note));
      toast.error("Note state changed!", toastOptions);
    } catch (error) {
      if (error.response.data.message === "Unauthorized") {
        navigate("/login");
      }
    }
  };
  const handleNoteTitleChange = async e => {
    const id = e.target.id;
    const title = e.target.value;
    try {
      await axios.put(`${editNoteRoute}/${id}`, {
            title
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          });
      setNotes(notes.map(note => note._id === id ? { ...note, title } : note));
    } catch (error) {
      if (error.response.data.message === "Unauthorized") {
        navigate("/login");
      }
    }
  };

  const handleAddClick = async e => {
    try {
      const response = await axios.post(`${addNoteRoute}/`, {
            state: false,
            title: note.title
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          });
      if (notes.length < 5) {
        setNotes([...notes, response.data.newNote]);
        setIsLast(true);
      } else {
        const response = await axios.get(`${allNotesGet}?page=${page+1}`, {
          withCredentials: true
        });
        setNotes(response.data.noteData.notes);
        setMaxPages(response.data.noteData.pages);
        setPage(page+1);
      }
      toast.error("New task has been added !", toastOptions);
    } catch (error) {
      if (error.response.data.message === "Unauthorized") {
        navigate("/login");
      }
    }
  };

  const handleNoteDelete = async e => {
    const { id } = e.target;
    try {
      await axios.delete(`${deleteNoteRoute}${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          });

      axios.get(`${allNotesGet}?page=${page}`, {
        withCredentials: true
      }).then(async response => {
        if (response.data.noteData.notes.length === 0) {
          try {
            if (page > 1) {
              const response = await axios.get(`${allNotesGet}?page=${page-1}`, {
                withCredentials: true
              });
              setNotes(response.data.noteData.notes);
              setMaxPages(response.data.noteData.pages);
              setPage(page-1);
            }
          } catch (error) {
            if (error.response.data.message === "Unauthorized") {
              navigate("/login");
            }
          }
        } else {
          setNotes(response.data.noteData.notes);
          setMaxPages(response.data.noteData.pages);
        }
      }).catch(error => {
        if (error.response.data.message === "Unauthorized") {
          navigate("/login");
        }
      });
      toast.error("Note has been deleted!", toastOptions);
    } catch (error) {
      if (error.response.data.message === "Unauthorized") {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (page === maxPages) {
      setIsLast(true);
    } else {
      setIsLast(false);
    }
  }, [page]);

  const clickNext = async e => {
    if (!isLast) {
      axios.get(`${allNotesGet}?page=${page + 1}`, {
        withCredentials: true
      }).then(response => {
        setNotes(response.data.noteData.notes);

        setPage(page + 1);
      }).catch(error => {
        if (error.response.data.message === "Unauthorized") {
          navigate("/login");
        }
      });
    }
  };

  const clickPrevious = async e => {
    if (page !== 1) {
      axios.get(`${allNotesGet}?page=${page - 1}`, {
        withCredentials: true
      }).then(response => {
        setNotes(response.data.noteData.notes);
        setPage(page - 1);
      }).catch(error => {
        if (error.response.data.message === "Unauthorized") {
          navigate("/login");
        }
      });
    }
  };

  return (
      <>
        <div className={"flex h-screen w-full items-center justify-center bg-gray-900 bg-cover"}>
          {isUserLoading ?
              (<>
                <div>
                  <div className="lds-ripple">
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </>) : (<>
                <div className={"flex flex-row justify-end fixed right-5 top-5 text-white"}>
                  <button onClick={handleClick}
                          className={"rounded-2xl min-w-0.5 max-w-1.5 border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}>{currentUser.username} -
                    Logout
                  </button>
                </div>
                <div
                    className={"rounded-xl flex flex-col justify-center min-w-[70%] max-w-[70%] bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md text-white max-sm:px-8 gap-5 min-w-screen-2xl"}>
                  <div className={"mb-4 flex flex-col flex-auto justify-center text-lg pt-5"}>
                    <div>
                      New Todo
                    </div>
                    <div className={"flex flex-auto"}>
                      <input
                          className={"rounded-xl min-w-[85%] max-w-[85%] bg-gray-900 bg-opacity-50 shadow-lg backdrop-blur-md gap-1 text-white p-2"}
                          onChange={(e) => {
                            setNote({ ...note, title: e.target.value });
                          }} />
                      <button
                          className={"mb-4 text-lg min-w-[15%] max-w-[15%] rounded-3xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}
                          onClick={handleAddClick}>
                        Add
                      </button>
                    </div>
                  </div>
                  <div className={"h-96 flex flex-col flex-auto content-center min-w-[100%] max-w-[100%] scroll-mt-0"}>
                    <div>
                      Your Todos
                    </div>
                    {isLoading ?
                        <></> : (notes.map(note => (<div key={note?._id} ref={scrollRef}>
                                  <div key={note?._id} className={"mb-4 text-lg pb-2 pt-2"}>
                                    <input id={note?._id} type={"checkbox"} onChange={handleNoteChange}
                                           defaultChecked={note.state} className={"accent-teal-800 min-w-[10%] max-w-[10%]"} />
                                    <input id={note?._id} value={note?.title} onChange={handleNoteTitleChange}
                                           className={"rounded-xl min-w-[80%] max-w-[80%] bg-gray-900 bg-opacity-50 shadow-lg backdrop-blur-md gap-1 text-white p-2"} />
                                    <button onClick={handleNoteDelete} id={note?._id}
                                            className={"rounded-2xl min-w-[10%] max-w-[10%] border-none bg-red-800 px-4 py-1 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}>
                                      X
                                    </button>
                                  </div>
                                </div>
                            ))
                        )
                    }</div>
                  <div className={"flex flex-row mt-2"}>
                    <button onClick={clickPrevious}
                            className={"flex-none text-lg rounded-3xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}>
                      Previous
                    </button>
                    <div className={"grow flex justify-evenly "}>
                      <div className={"items-center text-xl"}>{page} / {maxPages}</div>
                    </div>
                    <button onClick={clickNext}
                            className={"flex-none text-lg rounded-3xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}>
                      Next
                    </button>
                  </div>
                </div>
              </>)}
          <ToastContainer />
        </div>
      </>
  );
}