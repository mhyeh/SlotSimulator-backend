module.exports = {
  accountError:  {error: "account error",              code: 101},
  pwdError:      {error: "password error",             code: 102},
  checkPwdError: {error: "check password don't match", code: 103},
  tokenExpired:  {error: "token expired",              code: 104},
  accountUsed:   {error: "account has been used",      code: 105},
  emptyInput:    {error: "empty input",                code: 301},
  serverError:   {error: "server error",               code: 401},
  projectUsed:   {error: "project has been used",      code: 501},
  noProjectType: {error: "can not find project type",  code: 502},
  fsError:       {error: "can not read or write file", code: 601}
}