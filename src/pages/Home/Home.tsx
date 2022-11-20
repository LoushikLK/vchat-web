import { Button, Input } from "@chakra-ui/react";

const Home = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center ">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Input placeholder="Enter join Id" />

          <Button colorScheme="messenger">Join Room</Button>
        </div>
        <Button colorScheme="messenger">Create Room</Button>
        <Button colorScheme="messenger">Join Random</Button>
      </div>
    </section>
  );
};

export default Home;
