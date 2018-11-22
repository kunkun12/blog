import idx from 'idx';

function getFriends() {
  return idx(props, user => user.user.friends[0].friends)
};


const a = 1



async function printFiles () {
  const files = await getFilePaths();

  for (const file of files) {
    const contents = await fs.readFile(file, 'utf8');
    console.log(contents);
  }
}