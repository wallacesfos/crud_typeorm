import * as yup from 'yup';


export const registerSchema = yup.object().shape({
    name: yup.string().required("Campo de name obrigátorio"),
    email: yup.string().required("Campo de email obrigátorio"),
    isAdm: yup.bool().required("Campo de isAdm obrigátorio"),
    password: yup.string().required("Campo de senha obrigátorio"),
});

export const loginSchema = yup.object().shape({
    email: yup.string().required("Campo de email obrigátorio"),
    password: yup.string().required("Campo de password obrigátorio"),
});