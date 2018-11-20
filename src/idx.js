import idx from 'idx';

function getFriends() {
  return idx(props, user => user.user.friends[0].friends)
};


const a = 1