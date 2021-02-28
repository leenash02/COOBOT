const rules = {
  name: [
    {
      required: true,
      message: 'First Name is required',
    },
    {
      max: 64,
      message: 'First Name length cannot exceed 64 characters',
    },
    { whitespace: true }
  ],
  surname: [
    {
      required: true,
      message: 'Last Name is required',
    },
    {
      max: 64,
      message: 'Last Name length cannot exceed 64 characters',
    },
    { whitespace: true }
  ],
  userName: [
    {
      required: true,
      message: 'UserName is required',
    },
    {
      max: 256,
      message: 'UserName length cannot exceed 256 characters',
    },
    { whitespace: true }
  ],
  emailAddress: [
    {
      required: true,
      message: 'Email is required',
    },
    {
      type: 'email',
      message: 'Please enter a valid email',
    },
    {
      max: 256,
      message: 'Email length cannot exceed 256 characters',
    },
    { whitespace: true }
  ],
  password: [
    {
      required: true,
      message: "Password is required"
    },
    {
      pattern: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'),
      message: 'Please choose a strong password'
    },
    {
      max: 64,
      message: 'Email length cannot exceed 64 characters',
    },
    { whitespace: true }
  ],
};

export default rules;
