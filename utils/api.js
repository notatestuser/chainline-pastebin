export const createPaste = async (postBody) => {
  const response = await fetch('/api/paste', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postBody),
  });
  const body = await response.json();
  if (response.ok) {
    return body.id;
  }
  throw new Error(body.error);
};

export const getPaste = async (pasteId) => {
  const response = await fetch(`/api/paste/${pasteId}`);
  const body = await response.json();
  if (response.ok) {
    return body.text;
  }
  throw new Error(body.error);
};
