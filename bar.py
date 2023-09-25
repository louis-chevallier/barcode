import barcode
from barcode.writer import ImageWriter
import os, sys
import cv2
import numpy as np
from utillc import EKOI, EKOX, EKON, TYPE, ntimes, STACK
from PIL import Image
from io import BytesIO
from matplotlib import pyplot as plt
import albumentations as A

class GBC :
    
    def __init__(self) :
        np.random.seed(42)
        self.img0, aug, _ = self.gen1(1)
        EKOX(self.img0.shape)
        pass

    def gen(self) :
        fn = "bar.mp4"
        img, aug, _ = self.gen1(1)
        EKOX(img.shape)
        h,w,_ = img0.shape
        size = (w,h)
        pp = A.PadIfNeeded (min_height=h*2,
                            min_width=w*2,
                            border_mode=0, value=[255] *3,
                            p=1.0)
        lt =[
            pp,
            A.ShiftScaleRotate(shift_limit=0.2, scale_limit=0.2, rotate_limit=0, p=.75),
            A.Blur(blur_limit=2),
            A.Defocus(),
            A.GaussNoise(),
            A.HueSaturationValue(),            
        ]
        lt1 = [
            A.OpticalDistortion(),
            A.GridDistortion(),

            A.Perspective(),
            #A.RandomCrop(),
            A.RandomScale(),

        ]        
        transform = A.Compose(lt)
        
        videoWriter = cv2.VideoWriter(fn, cv2.VideoWriter_fourcc('m', 'p', '4', 'v'), 25, size)
        N = 100
        codes = np.random.randint(100, 1234567891, size=N, dtype=int)
        for i in codes :
            img, aug, rot = self.gen1(i, transform)
            img = pp(image=img)['image']
            EKOI(np.hstack((img, aug)))
            videoWriter.write(aug)
        videoWriter.release()
        
    def gen1(self, code, transform=None) :
        #EKOX(code)
        upci = barcode.upc.UniversalProductCodeA("%011d" % code, writer=ImageWriter())
        fp = BytesIO()
        upci.write(fp)
        rot = np.random.randint(-10, 10)
        
        fn = "tmp.png"
        fn = "f_%05d_%03d.png" % (code, rot)

        with open(fn, "wb") as f: upci.write(f)
        im = Image.open(fn)
        im = np.asarray(im)
        if transform is not None :
            h,w,_ = self.img0.shape
            
            t = A.ShiftScaleRotate(shift_limit=0, scale_limit=0, rotate_limit=rot, p=.75)
            a = t(image=im)['image']
            augmented_image = transform(image=a)['image']
        else :
            augmented_image = im
        
        #EKOX(fn.replace("f_", "fa_"))
        Image.fromarray(augmented_image).save(fn.replace("f_", "fa_"))
        return im, augmented_image, rot


        

if __name__ == '__main__':

    GBC().gen()
