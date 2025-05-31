import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUpload, faTrash, faMinus, faCloudArrowUp} from "@fortawesome/free-solid-svg-icons";
import AutocompleteDropdown from "../components/AutocompleteDropdown";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import SearchableDropdown from "../components/SearchableDropdown";

export default function CreateEditPostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!postId;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrls: [],
        price: "",
        location: "",
        tags: "",
        rating: 0,
    });
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            // TODO: fetch existing post
            // fetch(`/api/me/posts/${postId}`).then(r => r.json()).then(data => {
            //   setFormData({
            //     title: data.title,
            //     description: data.description,
            //     imageUrls: data.image_urls,
            //     price: data.price,
            //     location: data.location,
            //     tags: data.tags.map(t => t.name).join(", "),
            //     rating: data.rating,
            //   });
            //   setLoading(false);
            // });
            setLoading(false);
        }
    }, [isEdit, postId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((fd) => ({ ...fd, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        // TODO: upload and get URLs. For now, preview locally.
        const urls = files.map((f) => URL.createObjectURL(f));
        setFormData((fd) => ({ ...fd, imageUrls: urls }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            // TODO: PUT /api/me/posts/:postId with formData
        } else {
            // TODO: POST /api/me/posts with formData
        }
        navigate("/me/posts");
    };

    const handleDelete = () => {
        // TODO: DELETE /api/me/posts/:postId
        navigate("/me/posts");
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="container">
            <h2 className="mb-3">{isEdit ? "Edit Post" : "Create Post"}</h2>
            <form onSubmit={handleSubmit} className="card shadow-sm">
                <div className="row g-0">
                    <div className="col-6 d-flex p-4 flex-column align-items-center border-end">
                        {formData.imageUrls.length > 0 ? (
                            formData.imageUrls.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Preview ${idx}`}
                                    className="img-fluid mb-2"
                                />
                            ))
                        ) : (
                            <label
                                htmlFor="image-upload"
                                className="text-muted mb-2 p-4 w-100 h-100 text-center custom-dashed"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const files = Array.from(e.dataTransfer.files);
                                    const urls = files.map((f) => URL.createObjectURL(f));
                                    setFormData((fd) => ({...fd, imageUrls: urls}));
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                    <FontAwesomeIcon icon={faCloudArrowUp} className="mb-2" size="2x"/>
                                    <span>Drag and drop images here or click to upload</span>
                                </div>
                            </label>
                        )}
                        <PrimaryButton
                            className={"mt-auto"}
                            icon={<FontAwesomeIcon icon={faUpload} className="me-1"/>}
                            text={formData.imageUrls.length ? "Change Images" : "Upload"}
                            onClick={() => document.querySelector('input[type="file"]').click()} // fixme: can be done better...
                        />
                        <input
                            id={"image-upload"}
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="col-6 d-flex flex-column h-100 py-4 px-6">
                        <div className="mb-3">
                            <label htmlFor="title" className="fw-bold form-label">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col-6">
                                <label htmlFor="location" className={"fw-bold form-label"}>
                                    Location
                                </label>
                                <AutocompleteDropdown
                                    items={["Koper, Slovenia", "Warsaw, Poland", "Krakow, Poland", "Tokyo, Japan"]}
                                    id={"location"}
                                />
                            </div>
                            <div className="col-6">
                                <label htmlFor={"tags"} className={"fw-bold form-label"}>
                                    Tags
                                </label>
                                <SearchableDropdown
                                    items={[
                                        {label: "ECO", value: "eco", "color": "green"},
                                        {label: "Him", value: "him", "color": "blue"},
                                        {label: "Her", value: "her", "color": "pink"}
                                    ]}
                                    multiple={true}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="fw-bold form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="price" className="fw-bold form-label">Price</label>
                            <div className="input-group">
                                <div className="w-25">
                                    <SearchableDropdown
                                        items={[{label: "USD", value: "USD"}, {label: "EUR", value: "EUR"}, {label: "RUB", value: "RUB"}]}
                                        buttonClassName={"rounded-start rounded-end-0"}
                                    />
                                </div>

                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    className="form-control w-75"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-between gap-3 mt-4">
                            <SecondaryButton text={"Create"} onHoverTextColor={"#FFFFFF"} onHoverBackgroundColor={"#91B58B"} className="flex-grow-1"/>
                            <SecondaryButton text={"Cancel"} onHoverBackgroundColor={"#F0EEE6"} className="flex-grow-1"/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}