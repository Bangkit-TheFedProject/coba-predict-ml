const fs = require('fs');
const Path = require('path');
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');

const modelLocation = Path.join(__dirname,"/model/tfjs_model");
const imgSaveLocation = Path.join(__dirname, '/uploaded-img');

const EggPredictionController = {
    async predict (request, h) {
        try {
            const data = request.payload.image; // Data unggahan file dari request

            if (!data || !data.path) {
                return h.response('File tidak ditemukan').code(400);
            }
    
            const filePath = data.path;
            const imgBuffer = await sharp(filePath).resize(224,224).raw().toBuffer();
            const uint8Array = new Uint8Array(imgBuffer);
            const normalizedArray = Array.from(uint8Array).map(value => value / 255);
            const tensorGambar = tf.tensor(normalizedArray, [224, 224, 3]);

            const model_json = Path.join(modelLocation, "/model.json");
            const model = await tf.loadGraphModel(`file://${model_json}`);


            const className = ['Pertengahan', 'Tahap Akhir', 'Tahap Awal', 'Telur Mati'];

            try {
                const hasilPrediksi = model.predict(tensorGambar.expandDims(0)).squeeze().arraySync();
                const indexNilaiTertinggi = hasilPrediksi.indexOf(Math.max.apply(null, hasilPrediksi));

                return h.response({result : className[indexNilaiTertinggi]});

                // handling save image-nya disini
            } catch (error) {
                console.error('Terjadi kesalahan dalam proses prediksi:', error);
            }
           
        } catch (error) {
            console.error(error);
            return h.response('Terjadi kesalahan dalam pemrosesan file').code(500);
        }
    }
}

module.exports = EggPredictionController;
