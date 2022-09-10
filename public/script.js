const socket = io();

let room_id = window.location.pathname.substr(5);

const validateRoomId = (roomId) => (room_id !== roomId ? false : true);

console.log(room_id);
socket.on("new_message", (data) => {
  console.log("new");
  if (data.room_id === room_id) {
    document.getElementById("messageArea").innerHTML += `<div>
        Anonymous: <span style="color:green">
        ${data.message}
        </span>
    </div>
    `;
  }
});

socket.on("new_file", (data) => {
  console.log(data)
  if (validateRoomId(data.room_id)) {
    if (data.type === "image/png") {
      document.getElementById("messageArea").innerHTML += `
      Anonymous : 
      <img src='../tmp/${data.filename}' />
    `;
    }
    else{
        document.getElementById("messageArea").innerHTML += `
        Anonymous : 
        <a href='../tmp/${data.filename}'> ${data.filename} </a>
      `;
    }
  }
});

const sendMessage = (message) => {
  let data = {
    message,
    room_id,
  };

  document.getElementById("messageArea").innerHTML += `<div>
    Me: <span style="color:blue">
    ${data.message}
    </span>
</div>
`;

  socket.emit("new_message", data);
};

const sendFile = (file) => {
  let data = {
    file,
    room_id,
    filename: file.name,
    type: file.type,
  };

  const dummyUrl = URL.createObjectURL(file);

  if (data.type === "image/png") {
    document.getElementById("messageArea").innerHTML += `
    Me : 
    <img src='../tmp/${dummyUrl}' />
  `;
  }
  else{
      document.getElementById("messageArea").innerHTML += `
      Me : 
      <a href='../tmp/${dummyUrl}'> you sent a file </a>
    `;
  }

  socket.emit("new_file", data);
};
