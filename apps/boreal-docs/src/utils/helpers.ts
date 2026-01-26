export const disableControls = (args: any, arg: string) => {
  const { ...obj } = args;
  obj[arg] = {
    control: false,
    table: {
      disable: true,
    },
  };
  return obj;
};
