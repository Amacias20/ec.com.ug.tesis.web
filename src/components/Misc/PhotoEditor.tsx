import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';

interface PhotoEditorProps {
    imageSrc: string;
    onSave: (resultBase64: string) => void;
    onCancel: () => void;
}

const CROP_SIZE = 300;

function normalizeAngle(degrees: number) {
    return ((degrees % 360) + 360) % 360;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ imageSrc, onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startDrag, setStartDrag] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = imageSrc;
        img.onload = () => {
            drawImage(img);
        };
    }, [imageSrc, zoom, rotation, offset]);

    const drawImage = (img: HTMLImageElement) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);

        ctx.save();
        ctx.beginPath();
        ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        ctx.save();
        ctx.translate(CROP_SIZE / 2 + offset.x, CROP_SIZE / 2 + offset.y);
        ctx.rotate((normalizeAngle(rotation) * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = "#1976d2";
        ctx.lineWidth = 4;
        ctx.stroke();
    };

    const onMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragging || !startDrag) return;
        const dx = e.clientX - startDrag.x;
        const dy = e.clientY - startDrag.y;
        setOffset(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
        }));
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const onMouseUp = () => {
        setDragging(false);
        setStartDrag(null);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
    };

    const rotateLeft = () => setRotation(prev => normalizeAngle(prev - 15));
    const rotateRight = () => setRotation(prev => normalizeAngle(prev + 15));

    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.5)',
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <div style={{
                background: '#fff',
                padding: 32,
                borderRadius: 18,
                boxShadow: '0 8px 32px #0002',
                minWidth: 460,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h4 style={{
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: 22,
                    marginBottom: 28,
                    letterSpacing: 0.5
                }}>
                    Editor de imágenes
                </h4>
                <canvas
                    ref={canvasRef}
                    width={CROP_SIZE}
                    height={CROP_SIZE}
                    style={{
                        cursor: 'grab',
                        borderRadius: '50%',
                        background: '#f6f6f6',
                        boxShadow: '0 2px 10px #ddd',
                        margin: '10px 0'
                    }}
                    onMouseDown={onMouseDown}
                />
                <div style={{ width: '95%', margin: '28px 0 0 0' }}>
                    <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#2d2d2d' }}>Zoom</span>
                        <Slider value={zoom} min={0.5} max={2.5} step={0.01} onChange={e => setZoom(e.value as number)} style={{ width: '100%' }} />
                    </div>
                    <div style={{
                        marginBottom: 18,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 22,
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#2d2d2d' }}>Rotar</span>
                        <Button
                            icon="pi pi-undo"
                            aria-label="Rotar a la izquierda"
                            rounded
                            text
                            style={{ fontSize: 22, width: 44, height: 44 }}
                            onClick={rotateLeft}
                            tooltip="Rotar a la izquierda"
                            type="button"
                        />
                        <Button
                            icon="pi pi-redo"
                            aria-label="Rotar a la derecha"
                            rounded
                            text
                            style={{ fontSize: 22, width: 44, height: 44 }}
                            onClick={rotateRight}
                            tooltip="Rotar a la derecha"
                            type="button"
                        />
                        <span style={{
                            color: '#1976d2',
                            marginLeft: 8,
                            fontWeight: 700,
                            fontSize: 16,
                            width: 44,
                            textAlign: 'center',
                            display: 'inline-block'
                        }}>
                            {normalizeAngle(rotation)}°
                        </span>
                    </div>
                </div>
                <div style={{
                    marginTop: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 18,
                    width: '100%'
                }}>
                    <Button label="Guardar" type='submit' onClick={handleSave} icon={'pi pi-save'} style={{background: '#154270'}}/>
                    <Button label="Cancelar" onClick={onCancel} className="p-button-outlined" icon='pi pi-times' severity='danger' />
                </div>
            </div>
        </div>
    );
};

export default PhotoEditor;