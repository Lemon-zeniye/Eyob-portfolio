function ShareProfile({ onSuccess }: { onSuccess: () => void }) {
  const done = () => {
    onSuccess();
  };
  return <div onClick={() => done()}>ShareProfile</div>;
}

export default ShareProfile;
