import React, {useState, useEffect, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import AutocompleteDropdown from "../components/AutocompleteDropdown";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import SearchableDropdown from "../components/SearchableDropdown";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import {deepEqual} from "../utils/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, arrayMove, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import {useTags} from "../contexts/TagsProvider";

function SortableImageThumb({ item, index, onDelete, onReplace }) {
    const { setNodeRef, attributes, listeners, transform, transition } =
        useSortable({ id: index });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
        position: "relative"
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <img
                {...listeners}
                src={item.src} alt=""
                height="70" width="70"
                style={{ objectFit: "cover", borderRadius: "0.375rem" }}
                onClick={() => document.querySelector(`#postCarousel-${index}`)?.scrollIntoView()}/>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index)
                }}
                style={{width: "1.25rem", height: "1.25rem", borderRadius:"0.375rem"}}
                onPointerDown={e => e.stopPropagation()}
                className="btn btn-danger d-flex align-items-center justify-content-center position-absolute top-0 end-0 p-0"
            >
                ×
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onReplace(index)
                }}
                style={{width: "1.25rem", height: "1.25rem", borderRadius: "0.375rem"}}
                onPointerDown={e => e.preventDefault()}
                className="btn btn-light d-flex align-items-center justify-content-center position-absolute bottom-0 end-0 p-0"
            >
                ↺
            </button>
        </div>
    );
}


export default function CreateEditPostPage() {
    const [tags, setTags] = useState([]);
    const [locations, setLocations] = useState([]);
    const { postId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!postId;
    const fileInputRef = useRef(null);

    const carouselId = useRef(`postCarousel-${Math.random().toString(36).slice(2, 9)}`).current;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        images: [],
        price: "",
        location: "",
        tagIds: [],
        currency: "USD",
    });

    const [originalFormData, setOriginalFormData] = useState({
        title: "",
        description: "",
        images: [],
        price: "",
        location: "",
        tagIds: [],
        currency: "USD",
    });
    const [isChanged, setIsChanged] = useState(false);

    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
         axios.get(`${API_BASE_URL}/tags`).then(res => {
            setTags(res.data);
         });
         axios.get(`${API_BASE_URL}/locations`).then(res => {
             setLocations(res.data);
         });
    }, []);

    useEffect(() => {
        if (isEdit) {
            const response = axios.get(`${API_BASE_URL}/posts/${postId}`);
            response.then((res) => {
                const post = res.data;
                const images = post.images.map(img => ({
                    id: img.id,
                    src: API_BASE_URL + img.path,
                }));
                const cleaned = { ...post, images };   // same keys as before
                setFormData(cleaned);
                setOriginalFormData(cleaned);
                setLoading(false);
            });
        }
    }, [isEdit, postId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        setIsChanged(!deepEqual(updatedData, originalFormData));
    };

    const addImages = (files) => {
        const items = files.map(f => ({ id:-1, file:f, src:URL.createObjectURL(f) }));
        const updated = { ...formData, images:[...formData.images, ...items] };
        setFormData(updated);
        setIsChanged(!deepEqual(updated, originalFormData));
    };

    const deleteImage = (idx) => {
        const updated = {...formData, images: formData.images.filter((_,i)=>i!==idx)};
        setFormData(updated);
        setIsChanged(!deepEqual(updated, originalFormData));
    };

    const replaceImage = (idx) => {
        const inp = document.createElement("input");
        inp.type="file"; inp.accept="image/*";
        inp.onchange = ev => {
            const f = ev.target.files[0];
            if(!f) return;
            const copy = [...formData.images];
            copy[idx] = { id:-1, file:f, src:URL.createObjectURL(f) };
            const updated = {...formData, images:copy};
            setFormData(updated);
            setIsChanged(!deepEqual(updated, originalFormData));
        };
        inp.click();
    };

    const handleDragEnd = (e) => {
        const {active, over} = e;
        if(!over || active.id === over.id) return;
        const reordered = arrayMove(formData.images, active.id, over.id);
        const updated = {...formData, images: reordered};
        setFormData(updated);
        setIsChanged(!deepEqual(updated, originalFormData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        const orderedIds = [];

        formData.images.forEach(img => {
            if (img.id === -1) {        // new upload
                fd.append("images", img.file);     // keeps order
            }
            orderedIds.push(img.id);
        });

        fd.append("title", formData.title);
        fd.append("location", formData.location);
        fd.append("description", formData.description);
        fd.append("price", formData.price);
        fd.append("currency", formData.currency);
        fd.append("tagIds", JSON.stringify(formData.tagIds));
        fd.append("images", JSON.stringify(orderedIds));

        const url  = isEdit
            ? `${API_BASE_URL}/posts/${postId}`
            : `${API_BASE_URL}/posts`;

        await axios[isEdit ? "put" : "post"](url, fd, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        setIsChanged(false);
        setOriginalFormData(formData);
    };

    const handleDelete = () => {
        // TODO: DELETE /api/me/posts/:postId
        navigate("/me/posts");
    };

    const handleCancel = () => {
        setFormData(originalFormData);
        setIsChanged(false);
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="container">
            <h2 className="mb-3">{isEdit ? "Edit Post" : "Create Post"}</h2>
            <form className="card shadow-sm">
                <div className="row g-0">
                    <div className="col-6 d-flex p-4 flex-column align-items-center border-end">
                        {formData.images.length ? (
                            <>
                                {/** big preview **/}
                                {(() => {
                                    return (
                                        <div id={carouselId} className="carousel slide mb-3 w-100">
                                            {/* indicators */}
                                            <div className="carousel-indicators">
                                                {formData.images.map((_, i) => (
                                                    <button key={i}
                                                            type="button"
                                                            data-bs-target={`#${carouselId}`}
                                                            data-bs-slide-to={i}
                                                            className={i === 0 ? "active" : ""}
                                                            aria-label={`Slide ${i + 1}`}
                                                            style={{borderRadius:"100%", width:"1rem", height:"1rem"}} />
                                                ))}
                                            </div>

                                            {/* slides */}
                                            <div className="carousel-inner">
                                                {formData.images.map((img, i) => (
                                                    <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                                                        <img src={img.src}
                                                             alt=""
                                                             className="d-block w-100 rounded" />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* controls */}
                                            <button className="carousel-control-prev" type="button"
                                                    data-bs-target={`#${carouselId}`} data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" />
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button className="carousel-control-next" type="button"
                                                    data-bs-target={`#${carouselId}`} data-bs-slide="next">
                                                <span className="carousel-control-next-icon" />
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    );
                                })()}

                                {/** ============ SORTABLE THUMB STRIP ============ **/}
                                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={formData.images.map((_, i) => i)}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        <div className="d-flex overflow-auto gap-2 mb-3">
                                            {formData.images.map((img, idx) => (
                                                <SortableImageThumb
                                                    key={idx}
                                                    index={idx}
                                                    item={img}
                                                    onDelete={deleteImage}
                                                    onReplace={replaceImage}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </>
                        ) : (
                            <label
                                htmlFor="image-upload"
                                className="text-muted mb-2 p-4 w-100 h-100 text-center custom-dashed"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={e => {
                                    e.preventDefault();
                                    addImages(Array.from(e.dataTransfer.files))
                                }}
                                onClick={() => fileInputRef.current.click()}
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
                            text={formData.images.length ? "Add More" : "Upload"}
                            onClick={()=> fileInputRef.current.click()}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={e=> addImages(Array.from(e.target.files))}
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
                                    items={locations}
                                    id={"location"}
                                    defaultValue={formData.location}
                                    onChange={value => {
                                        const updated = { ...formData, location: value };
                                        setFormData(updated);
                                        setIsChanged(!deepEqual(updated, originalFormData));
                                    }}
                                />
                            </div>
                            <div className="col-6">
                                <label htmlFor={"tags"} className={"fw-bold form-label"}>
                                    Tags
                                </label>
                                <SearchableDropdown
                                    items={tags}
                                    multiple={true}
                                    defaultValue={formData.tagIds}
                                    onChange={ids => {
                                        const updated = { ...formData, tagIds: ids };
                                        setFormData(updated);
                                        setIsChanged(!deepEqual(updated, originalFormData));
                                    }}
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
                                        items={[
                                            { id: "USD", label: "USD" },
                                            { id: "EUR", label: "EUR" },
                                            { id: "RUB", label: "RUB" }
                                        ]}
                                        buttonClassName={"rounded-start rounded-end-0"}
                                        defaultValue={formData.currency}
                                        onChange={id => {
                                            const updated = { ...formData, currency: id };
                                            setFormData(updated);
                                            setIsChanged(!deepEqual(updated, originalFormData));
                                        }}
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

                        {isChanged && (
                            <div className="d-flex justify-content-between gap-3 mt-4">
                                <SecondaryButton
                                    text={isEdit ? "Update" : "Create"}
                                    onHoverTextColor={"#FFFFFF"}
                                    onHoverBackgroundColor={"#91B58B"}
                                    className="flex-grow-1"
                                    onClick={handleSubmit}
                                />
                                <SecondaryButton
                                    text={"Cancel"}
                                    onHoverBackgroundColor={"#F0EEE6"}
                                    className="flex-grow-1"
                                    onClick={handleCancel}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}