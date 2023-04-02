export const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.params?.id === req.user.id.toString()) {
    next();
  } else {
    res.json({ success: false, message: 'Unauthorized access' });
  }
};

// por un lado comprobamos si el usuario es administrador o si es usuario normal y el id que pone en la request (string) es igual al id que aparece dentoro de su perfil (object) --> si es admin siempre puede segui y si es un usuario normal solo si ambos id coinciden

/**
 * En Thunder Client, si soy Admin y quiero ver todos los usuarios, en 'Headers' tengo que añadir rn el request headers --> token=>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDFkNGM3N2ZmYTQyOWM1YzMxZDdkZWQiLCJlbWFpbCI6InJpY2NhcmFsdkB0ZXN0LmNvbSIsImlhdCI6MTY3OTY4OTU3NywiZXhwIjoxNjc5NjkzMTc3LCJhdWQiOiJlLXN0b3JlLXVzZXIiLCJpc3MiOiJMaWxpIn0.4dzAVu4Xf_NEpL4JeQ8gvmtkcrXVuo6VBMPH7czEb94 (que lo copio de mi response headers cuando hago el login)
 */
