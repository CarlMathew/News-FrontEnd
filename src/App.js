import "./App.css";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

function App() {
  const [news, setNews] = useState([]);
  return (
    <div className="h-screen">
      <Navbar news={news} setNews={setNews} />
      <News news={news} setNews={setNews} />
    </div>
  );
}

function Navbar({ news, setNews }) {
  const dialogRef = useRef(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };
  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <div className="flex text-white justify-around p-6">
      <dialog
        ref={dialogRef}
        className="w-5/6 md:w-2/6 rounded-[10px] border-2 border-black bg-[#fff]"
      >
        <div className="flex flex-row justify-center p-5 gap-2">
          <h1 className="text-2xl font-semibold px-8 bg-orange-300 shadow-xl rounded-full ">
            Post your News <i className="fa-solid fa-newspaper mx-2"></i>
          </h1>
        </div>
        <AddNews close={closeDialog} setNews={setNews} />
      </dialog>
      <div className="w-2/6 text-xl text-yellow-200 px-6 py-1">News</div>
      <div className=" w-2/6 flex justify-end text-xl">
        <button
          className="bg-black px-6 py-1 rounded-full shadow shadow-slate-500"
          onClick={openDialog}
        >
          Post a News
        </button>
      </div>
    </div>
  );
}

function AddNews({ close, news, setNews }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("title", title);
    formData.append("tag", tags);
    if (image) formData.append("image", image);
    const endpoint = "http://127.0.0.1:8000/api/create_news";

    axios
      .post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("News Posted Successfully", response.data);
        setNews((prevNews) => {
          const newNews = [...prevNews, response.data];

          return newNews;
        });

        close();
      })
      .catch((error) => {
        console.error("Error uploading news:", error);
      });

    setContent("");
    setTitle("");
    setImage(null);
    setTags("");
  }
  return (
    <div>
      <form
        className="flex flex-col items-center mb-10 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-3/6">
          <label htmlFor="content" className="text-xl font-bold">
            Content
          </label>
          <textarea
            className="border-2 rounded border-blue-400 px-2 focus:scale-110 focus:shadow-lg focus:outline-none focus:shadow-black transition duration-150"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="flex flex-col w-3/6">
          <label htmlFor="title" className="text-xl font-bold">
            Title
          </label>
          <input
            id="title"
            className="border-2 rounded border-blue-400 px-2 focus:scale-110 focus:shadow-lg focus:outline-none focus:shadow-black transition duration-150"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-3/6">
          <label htmlFor="image" className="text-xl font-bold">
            Image
          </label>
          <div>
            <input
              id="image"
              className=" absolute opacity-0 border-2 rounded border-blue-400 focus:scale-110 focus:shadow-lg focus:outline-none focus:shadow-black transition duration-150"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="flex flex-row gap-2 border-2 rounded border-blue-400 focus:scale-110 focus:shadow-lg focus:outline-none focus:shadow-black transition duration-150 cursor-pointer">
              <button className=" bg-blue-400 rounded px-2 text-white ">
                Choose a file
              </button>
              <h1 className="">{image ? image.name : "No file chosen"}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-3/6">
          <label htmlFor="tags" className="text-xl font-bold">
            Tags
          </label>
          <input
            id="tags"
            className="border-2 rounded border-blue-400 px-2 focus:scale-110 focus:shadow-lg focus:outline-none focus:shadow-black transition duration-150"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-between w-1/2">
          <button
            type="submit"
            className="px-6 bg-blue-400 text text-white py-1 rounded-[10px] font-bold"
          >
            Post
          </button>
          <button
            className="px-6 bg-red-400 text text-white py-1 rounded-[10px] font-bold"
            onClick={(e) => {
              e.preventDefault();
              close();
            }}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

function News({ news, setNews }) {
  const dialogRefs = useRef({});

  const openDialog = (id) => {
    console.log(dialogRefs);
    // Use the specific dialog ref for this item

    dialogRefs.current[id].showModal();
  };

  const closeDialog = (id) => {
    console.log(dialogRefs.current[id]);
    dialogRefs.current[id].close();
  };
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/news");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching News", error);
      }
    };
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const uiAnimatedItems = document.querySelectorAll(
      ".news-item:not(.animated)"
    );
    anime({
      targets: uiAnimatedItems,
      scale: [0, 1],
      opacity: [0, 1],
      duration: 800,
      easing: "easeOutBounce",
      delay: anime.stagger(500),
      complete: function (anim) {
        uiAnimatedItems.forEach((element) => {
          element.classList.add("animated");
        });
      },
    });
  }, [news]);

  function handleClick(id) {
    const endpoint = "http://127.0.0.1:8000/api/delete_news";
    // const itemId = e.currentTarget.getAttribute("data-id"); // Get the data-id attribute
    axios
      .delete(endpoint, {
        params: { id: id },
      })
      .then((response) => {
        setNews(response.data.data);
      })
      .catch((error) => {
        console.error("Error Deleting Product", error);
      });
  }

  function handleLikes(e) {
    const endpoint = "http://127.0.0.1:8000/api/update_likes";
    const itemId = e.currentTarget.getAttribute("data-id");
    const num_likes = Number(e.currentTarget.getAttribute("data-likes"));

    axios
      .put(endpoint, {
        id: itemId, // Send the ID in the body
        likes: num_likes + 1, // Send the updated likes count
      })
      .then((response) => {
        setNews(response.data.data); // Update the news list with the new data
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function handleDislikes(e) {
    const endpoint = "http://127.0.0.1:8000/api/update_dislike";
    const itemId = e.currentTarget.getAttribute("data-id");
    const num_dislikes = Number(e.currentTarget.getAttribute("data-dislikes"));

    console.log(num_dislikes);
    console.log(itemId);
    axios
      .put(endpoint, {
        id: itemId, // Send the ID in the body
        dislikes: num_dislikes + 1, // Send the updated likes count
      })
      .then((response) => {
        setNews(response.data.data); // Update the news list with the new data
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div className="flex flex-row p-6 justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-5/6 px-6 py-1">
        {news.map((item) => (
          <div
            key={item.id}
            className="news-item bg-white flex flex-col md:flex-row max-h-96 h-auto md:h-72 rounded-[15px]  shadow-xl border-2 bg-gradient-to-r from-sky-400 to-purple-100 "
          >
            <dialog
              ref={(el) => (dialogRefs.current[item.id] = el)}
              className="border-2 border-black rounded-xl shadow-xl shadow-black"
            >
              <div className="w-50 flex flex-col items-center p-5">
                <h1 className="px-5 text-xl text-white bg-orange-400 rounded">
                  Are you sure you want to delete this post?
                </h1>
                <div className="flex justify-between w-1/2 mt-5">
                  <button
                    className="px-4 bg-red-500 text-white text-xl rounded-lg shadow transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:shadow-black hover:shadow-xl"
                    onClick={() => handleClick(item.id)}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => closeDialog(item.id)}
                    className="px-4 bg-green-500 text-white text-xl rounded-lg shadow transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:shadow-black hover:shadow-xl"
                  >
                    No
                  </button>
                </div>
              </div>
            </dialog>
            <div className="w-full md:w-2/6 flex justify-center items-center relative">
              <div
                className="h-auto md:h-4/6 w-full  rounded-es-3xl rounded- md:absolute md:-left-6  shadow-black shadow-lg bg-center bg-cover border-2 border-violet-600"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
            </div>
            <div className="w-full  md:w-4/6 flex flex-col justify-center items-start relative ">
              <button data-id={item.id} onClick={() => openDialog(item.id)}>
                <i className="fa-solid fa-xmark text-white rounded-full absolute -right-3 -top-2 bg-red-600 p-2 px-3"></i>
              </button>

              <div className="overflow-x-hidden">
                <h1 className="text-md font-extrabold w-5/6 text-justify">
                  {item.title}
                </h1>
                <ul className="flex flex-wrap gap-2 mt-3">
                  {item.split_tag.map((tag) => (
                    <li className="text-[12px] px-4 bg-black text-white rounded-full">
                      {tag}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-justify w-5/6">
                  {item.content}
                </p>
                <div className="flex flex-row gap-4 mt-3">
                  <button
                    data-id={item.id}
                    data-likes={item.likes}
                    onClick={handleLikes}
                  >
                    <i className="fa-regular fa-thumbs-up"></i> {item.likes}
                  </button>
                  <button
                    data-id={item.id}
                    data-dislikes={item.dislikes}
                    onClick={handleDislikes}
                  >
                    <i className="fa-regular fa-thumbs-down mx-1"></i>
                    {item.dislikes}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
