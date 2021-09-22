import axios from 'axios';
import { useState } from 'react';


const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        setErrors(null);

        try {
            const response = await axios(url, {
                method: method,
                data: { ...body, ...props },
            });

            onSuccess && onSuccess(response.data);

            return response.data;
        }
        catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul>
                        {err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
                    </ul>
                </div>
            )
        }
    }

    return { doRequest, errors };
}

export default useRequest